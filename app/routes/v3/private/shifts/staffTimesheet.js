const ClientError = require('../../../../../lib/errors/ClientError');
const moment = require('moment');

function checkFields(obj, fields) {
  var i;
  for (i = 0; i < fields.length; i++) {
    var field = fields[i];
    if ('undefined' === typeof(obj[field]) || obj[field] === null) {
      return field;
    }
  }
  return true;
}

const workedFields = [
  'staffStartTime',
  'staffEndTime',
  'staffBreaks',
  'enjoyed',
  'managerComments',
  'venueComments',
  'generalComments',
];

const noWorkedFields = [
  'noWorkReason'
]

module.exports = function(router) {
  router.get('/staffTimesheet/:id', function(req, res, next) {
    var { sequelize } = req.app.locals;
    var shiftId = req.params.id;
    var cache = req.app.locals.timesheetCache;
    var key = JSON.stringify({
      shiftId,
      user: req.user.id
    });
    return cache.getOrSet(key, function(result) {
      return sequelize.query(`select paid, timesheetID, timesheetStatus,
        staffStartTime, staffEndTime, staffBreaks, staffWorked, shiftID,
        originalStartTime, originalEndTime, originalBreaks,
        hourlyRate, [date], eventID, eventTitle, eventSubtitle, jobRole, clientName, venueID, venueName,
        venueImage from dbo.udf_userWorkHistory(:userId, 0, 50, null, null) where shiftID = :shiftId`,
      {
        replacements: {
          userId: req.user.id,
          shiftId
        },
        type: sequelize.QueryTypes.SELECT
      })
    }).then(function(result) {
      if (result.length) {
        res.jsend(result[0]);
      } else {
        res.jsend(null);
      }
    }).catch(function(err) {
      next(err);
    });
  });
  router.post('/staffTimesheet', function(req, res, next) {
    var { models, sequelize } = req.app.locals;
    var timesheet = req.body;
    if (checkFields(timesheet, ['timesheetID', 'staffWorked']) !== true) {
      throw new ClientError('no_timesheet', {message: 'Must supply a value for timesheetID and staffWorked'});
    }
    var fields = timesheet.staffWorked? workedFields: noWorkedFields;
    var field = checkFields(timesheet, fields);
    if (field !== true) {
      throw new ClientError(`no_${field}`, {message: `If you did${timesheet.staffWorked? '': "n't"} work, you must supply a value for ${field}`});
    }
    return Promise.all([models.users.findOne({
      where: {
        id: req.user.id
      }
    }), models.userTimesheets.findOne({
      where: {
        id: timesheet.timesheetID
      },
      include: [{
        model: models.userTimesheetsCompleted,
        as: 'timesheetsCompleted',
        include: [{
          model: models.users,
          as: 'user',
          where: {
            id: req.user.id
          }
        }],
        required: false
      }, {
        model: models.eventShifts,
        as: 'shift',
        include: [{
          model: models.events,
          as: 'event'
        }]
      }]
    })]).then(function([user, originalTimesheet]) {
      if (!originalTimesheet) {
        throw new ClientError('no_timesheet', {message: 'No such timesheet'});
      }
      if (originalTimesheet.timesheetsCompleted.length > 0) {
        throw new ClientError('already_completed', {message: 'You have already completed this timesheet'});
      }
      return Promise.all([models.userTimesheetsCompleted.create({
        startTime: moment.utc(timesheet.staffStartTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        endTime: moment.utc(timesheet.staffEndTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        breaks: timesheet.staffBreaks,
        worked: timesheet.staffWorked,
        comments: '',
        status: originalTimesheet.status,
        staffEnjoyed: timesheet.enjoyed,
        staffManagerComments: timesheet.managerComments,
        staffVenueComments: timesheet.venueComments,
        staffGeneralComments: timesheet.generalComments,
      }), user, originalTimesheet]);
    }).then(function([timesheetCompleted, user, originalTimesheet]) {
      return Promise.all([
        timesheetCompleted,
        timesheetCompleted.setTimesheet(originalTimesheet),
        timesheetCompleted.setShift(originalTimesheet.shift),
        timesheetCompleted.setEvent(originalTimesheet.shift.event),
        timesheetCompleted.setUser(user),
        timesheetCompleted.setUserModified(user),
      ])
    }).then(function([timesheetCompleted, ...promises]) {
      res.jsend({
        completedID: timesheetCompleted.id
      })
    }).catch(function(err) {
      next(err);
    })
  });
}
