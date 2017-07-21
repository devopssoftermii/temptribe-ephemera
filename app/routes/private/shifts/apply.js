var moment = require('moment');
var ClientError = require('../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed
} = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/apply/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'standard', 'future']
    }).findById(id).then(function(shift) {
      return Promise.all([shift, shift.getTimesheets()]);
    }).then(function([shift, timesheets]) {
      return Promise.all(timesheets.map(function(timesheet) {
        return timesheet.getUser().then(function(user) {
          if (timesheet.status = 4 && user.id === req.user.id) {
            throw new ClientError('already_booked', { message: 'You are already booked on this shift' });
          }
        }).catch(function(err) {
          throw err;
        });
      })).then(function() {
        return shift;
      });
    }).then(function(shift) {
      return getClashingShifts(models, sequelize, shift, req.user.id).then(function(clashing) {
        if (clashing && clashing.length) {
          throw new ClientError('already_booked_other', { message: 'You are already booked on another shift at this time' });
        }
        return shift;
      }).catch(function(err) {
        throw err;
      });
    }).then(function(shift) {
      return Promise.all([shift, isFullyStaffed(sequelize, shift.id)]);
    }).then(function([shift, fullyStaffed]) {
      var favourites = new Set(req.user.favouritedBy.map(function(client) {
        return client.id;
      }));
      return Promise.all([shift, bookUserOnShift(
        models,
        sequelize,
        shift.id,
        req.user.id,
        favourites.has(shift.event.client.id) && !fullyStaffed
      )]);
    }).then(function([shift, result]) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
