var moment = require('moment');
var ClientError = require('../../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed,
  bookUserOnShift
} = require('../../../../../lib/events');

module.exports = function(router) {
  router.use(function(req, res, next) {
    res.locals.forceUserCheck = true;
    next();
  });
  require('../../../../middleware/auth')(router);
  router.post('/apply/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'standard', req.user.blacklistedBy, 'future']
    }).findById(id).then(function(shift) {
      if (!shift) {
        throw new ClientError('invalid_shift', { message: 'No such shift' });
      }
      return shift.getTimesheets().then(function(timesheets) {
        return Promise.all(timesheets.map(function(timesheet) {
          return timesheet.getUser().then(function(user) {
            if (timesheet.status === 4 && user.id === req.user.id) {
              throw new ClientError('already_booked', { message: 'You are already booked on this shift' });
            }
          }).catch(function(err) {
            throw err;
          });
        }))
      }).then(function() {
        return getClashingShifts(models, sequelize, shift, req.user.id).then(function(clashing) {
          if (clashing && clashing.length) {
            throw new ClientError('already_booked_other', { message: 'You are already booked on another shift at this time' });
          }
          return shift;
        }).catch(function(err) {
          throw err;
        });
      }).then(function() {
        var favourites = new Set(req.user.favouritedBy);
        return bookUserOnShift(
          models,
          sequelize,
          shift,
          req.user.id,
          favourites.has(shift.event.client.id)
        );
      });
    }).then(function(status) {
      res.json({
        result: status
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
