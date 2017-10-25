// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');
const moment = require('moment');

var app = {};

// Initialise DB
require('./data')(app);

const { sequelize, models } = app.locals;
models.eventShifts.findAll({
  attributes: ['originalStartTime'],
  include: [{
    attributes: ['eventDate'],
    model: models.events,
    as: 'event',
    where: {
      eventDate: {
        $gte: sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
        $lt: sequelize.fn('dateadd', sequelize.literal('DAY'), 2, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
      },
      status: {
        $not: 5
      }
    },
    include: [{
      model: models.venues,
      as: 'venue',
      attributes: ['name'],
      required: true
    }, {
      model: models.clients,
      as: 'client',
      attributes: ['clientName'],
      required: true
    }],
  }, {
    model: models.userTimesheets,
    as: 'timesheets',
    where: {
      status: 4
    },
    include: [{
      model: models.users,
      as: 'user',
      attributes: ['firstname', 'email'],
      required: true
    }],
  }],
  where: {
    originalStartTime: {
      $gte: sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), -1, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
      $lt: sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate'))),
    },
    status: {
      $notIn: [0, 2, 7]
    }
  }
}).then(function(results) {
  if (results.length) {
    var emails = [];
    results.forEach(function(shift) {
      shift.timesheets.forEach(function(timesheet) {
        emails.push({
          to: timesheet.user.email,
          data: {
            firstname: timesheet.user.firstname,
            venue: shift.event.venue.name
          }
        });
      });
    })
    mailer.sendBatch('shiftReminder', emails).then(function() {
      process.exit();
    }).catch(function() {
      process.exit();
    });
  } else {
    process.exit();
  }
});