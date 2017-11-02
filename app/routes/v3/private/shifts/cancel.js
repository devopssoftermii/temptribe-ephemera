var moment = require('moment');
var ClientError = require('../../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed,
  bookUserOnShift
} = require('../../../../../lib/events');

module.exports = function(router) {
  router.post('/cancel/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'full', req.user.blacklistedBy, 'future', req.user.id]
    }).findById(id).then(function(shift) {
      if (!shift) {
        throw new ClientError('invalid_shift', { message: 'No such shift' });
      }
      return shift;
    }).then(function(shift) {
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
    }).then(function(timesheet) {
      return cache.pdel(JSON.stringify({
        userShifts: req.user.id
      })).then(function() {
        return timesheet;
      }).catch(function(err) {
        throw err;
      });
    }).then(function(timesheet) {
      res.jsend({
        result: timesheet.result
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
