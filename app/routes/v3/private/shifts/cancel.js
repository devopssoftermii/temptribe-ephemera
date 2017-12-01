var moment = require('moment');
var ClientError = require('../../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed,
  bookUserOnShift,
  checkAndUpdateEventStatusFromEventId
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
    dateStamp: sequelize.fn('getdate'),
    actionedBy: 'staff'
  }, {
    fields: ['status', 'dateStamp','actionedBy']
  });
}

var deleteCache = function (userId,cache) {
  return cache.pdel(JSON.stringify({
    userShifts: userId
  })).catch(function(err) {
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
    .then(shift => {
      var eventId = shift.event.id
      return updateTimesheetsOnShift(shift,sequelize)
      .then(timesheet => {
        return deleteCache(userId,cache)
        .then((v) => checkAndUpdateEventStatusFromEventId(models, sequelize, eventId))
        .then((v) => timesheet)
        .catch(function(err) {
          next(err);
        });
      })
    })
    .then(timesheet => {
      res.jsend({
        result: timesheet.result
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
