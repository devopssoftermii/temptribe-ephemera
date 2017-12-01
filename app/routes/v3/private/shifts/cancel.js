var moment = require('moment');
var ClientError = require('../../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed,
  bookUserOnShift
} = require('../../../../../lib/events');

var getEventShift = function(id,blacklistedBy,userId,models) {
  var eventShiftScope = {method: ['staff', 'full', blacklistedBy, 'future', userId]}
  return models.eventShifts.scope(eventShiftScope).findById(id)
}

var updateTimesheetsOnShift = function (shift,sequelize) {
  if (!shift) {
    throw new ClientError('invalid_shift', { message: 'No such shift' });
  }
  var actualStartTime = moment.utc(moment.utc(shift.event.eventDate).format('YYYY-MM-DD') + ' ' + shift.startTime, 'YYYY-MM-DD HH:mm');
  if (shift.timesheets[0].status === 4 && !moment.utc().add(parseInt(process.env.STAFF_CANCELLATION_CUTOFF, 10), 'hours').isBefore(actualStartTime)) {
    throw new ClientError('too_late', { message: `You cannot cancel this shift as it is less than ${process.env.STAFF_CANCELLATION_CUTOFF} hours away` });
  }
  return shift.timesheets[0].update({
    status: 7,
    dateStamp: sequelize.fn('getdate')
  }, {
    fields: ['status', 'dateStamp']
  });
}

var deleteCache = function (timesheet,userId,cache) {
  return cache.pdel(JSON.stringify({
    userShifts: userId
  })).then(function() {
    return timesheet;
  }).catch(function(err)
    throw err;
  });
}

module.exports = function(router) {
  router.post('/cancel/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    var blacklistedBy = req.user.blacklistedBy;
    var userId = req.user.id;

    getEventShift(id,blacklistedBy,userId,models)
    .then(shifts => updateTimesheetsOnShift(shifts,sequelize))
    .then(timesheet =>  deleteCache(timesheet,userId,cache))
    .then(timesheet => {
      res.jsend({
        result: timesheet.result
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
