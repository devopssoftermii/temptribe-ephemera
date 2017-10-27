// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');
const notifications = require('./lib/notifications');
const moment = require('moment');

var app = {};

// Initialise DB
require('./data')(app);

const { sequelize, models } = app.locals;

function remindShifts(dateStart, dateEnd, timeStart, timeEnd, title, bodyFunc, icon, mail) {
  return models.eventShifts.findAll({
    attributes: ['originalStartTime'],
    include: [{
      attributes: ['eventDate'],
      model: models.events,
      as: 'event',
      where: {
        eventDate: {
          $gte: dateStart,
          $lt: dateEnd,
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
        attributes: ['id', 'firstname', 'email'],
        required: true
      }],
    }],
    where: {
      originalStartTime: {
        $gte: timeStart,
        $lt: timeEnd,
      },
      status: {
        $notIn: [0, 2, 7]
      }
    }
  }).then(function(results) {
    if (results.length) {
      var emails = [];
      Promise.all(results.map(function(shift) {
        var userIds = shift.timesheets.map(function(timesheet) {
          return timesheet.user.id;
        });
        var body = bodyFunc(shift.originalStartTime, shift.event.client.clientName, shift.event.venue.name);
        var data = {
          routeName: 'EventDetails',
          params: {
            shiftId: shift.id
          }
        };
        return notifications.send(models, userIds, notificationTitle, body, data, icon).then(function(result) {
          shift.timesheets.forEach(function(timesheet) {
            if (result.to.userIds.indexOf(timesheet.user.id) === -1) {
              emails.push({
                to: timesheet.user.email,
                data: {
                  firstname: timesheet.user.firstname,
                  venue: shift.event.venue.name
                }
              });
            }
          });
        });
      })).then(function() {
        if (mail) {
          mailer.sendBatch('shiftReminder', emails);
        }
      });
    }
  });
}

Promise.all([remindShifts(
  sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('dateadd', sequelize.literal('DAY'), 2, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), -1, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate'))),
  'Shift Reminder 🔔',
  function(startTime, client, venue) {
    return `You’ve got a shift tomorrow at ${startTime} for ${client} at ${venue}! Make sure you read the shift notes carefully to help you to get ready!`
  },
  'ic_shift_reminder',
  true
), remindShifts(
  sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate')),
  sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 4, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 5, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  'Time to Get Ready ⏱',
  function(startTime, client, venue) {
    return `Your shift today starts at ${startTime}! Make sure you know when to arrive, what to wear and where to meet your tribe!`
  },
  'ic_shift_reminder',
  false
)]).then(function() {
  process.exit();
}).catch(function() {
  process.exit();
});