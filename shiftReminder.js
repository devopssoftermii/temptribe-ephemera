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

function remindShifts(dateStart, dateEnd, timeStart, timeEnd, timeField, title, bodyFunc, icon, routeName, mail) {
  return models.eventShifts.findAll({
    attributes: ['id', timeField],
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
    }],
    where: {
      [timeField]: {
        $gte: timeStart,
        $lt: timeEnd,
      },
      status: {
        $notIn: [0, 2, 7]
      }
    }
  }).then(function(results) {
    if (!results.length) {
      return true;
    }
    var emails = [];
    return Promise.all(results.map(function(shift) {
      return sequelize.query('select * from dbo.udf_getCurrentTimesheetsForShift(:shiftId) where status = 4', {
        replacements: {
          shiftId: shift.id,
        },
        type: sequelize.QueryTypes.SELECT
      }).then(function(timesheets) {
        if (!timesheets.length) {
          return true;
        }
        var userIds = timesheets.map(function(timesheet) {
          return timesheet.userID;
        });
        var body = bodyFunc(moment.utc(shift[timeField]).format('h:mma'), shift.event.client.clientName, shift.event.venue.name);
        var data = {
          routeName,
          params: {
            shiftId: shift.id
          }
        };
        timesheets.forEach(function(timesheet) {
          emails.push({
            to: timesheet.email,
            data: {
              firstname: timesheet.firstname,
              venue: shift.event.venue.name
            }
          });
        });
        return notifications.send(models, userIds, title, body, data, icon);
      });
    })).then(function() {
      if (mail) {
        mailer.sendBatch('shiftReminder', emails);
      }
    });
  });
}

Promise.all([remindShifts(
  sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('dateadd', sequelize.literal('DAY'), 2, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), -1, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate'))),
  'originalStartTime',
  'Shift Reminder 🔔',
  function(startTime, client, venue) {
    return `You’ve got a shift tomorrow at ${startTime} for ${client} at ${venue}! Make sure you read the shift notes carefully to help you to get ready!`
  },
  'ic_shift_reminder',
  'EventDetails',
  true
), remindShifts(
  sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate')),
  sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 4, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 5, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  'originalStartTime',
  'Time to Get Ready ⏱',
  function(startTime, client, venue) {
    return `Your shift today starts at ${startTime}! Make sure you know when to arrive, what to wear and where to meet your tribe!`
  },
  'ic_shift_reminder',
  'EventDetails',
  false
), remindShifts(
  sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate')),
  sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 4, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  sequelize.fn('convert', sequelize.literal('DATETIMEOFFSET'), sequelize.fn('dateadd', sequelize.literal('HOUR'), 5, sequelize.fn('convert', sequelize.literal('TIME'), sequelize.fn('getdate')))),
  'originalFinishTime',
  'Complete your timesheet',
  function(finishTime, client, venue) {
    return `Don't forget to complete the timesheet for your shift!`
  },
  'ic_timesheet_reminder',
  'TimesheetDetails',
  false
)]).then(function() {
  process.exit(0);
}).catch(function() {
  process.exit(1);
});