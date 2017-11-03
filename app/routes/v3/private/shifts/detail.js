var eventHelpers = require('../../../../../lib/events');

module.exports = function(router) {
  router.get('/detail/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    var key = JSON.stringify({
      shiftId: id,
      user: req.user.id
    });
    return Promise.all([
      cache.pget(key).then(function(result) {
        if (result) {
          return result;
        }
        return models.eventShifts.scope({
          method: ['staff', 'full', req.user.blacklistedBy, 'future']
        }).findById(id).then(function(shift) {
          if (!shift) {
            return null;
          }
          return cache.pset(key, eventHelpers.formatShift(shift.get({ plain: true }), req.user.favouritedBy, 'full', true, true));
        }).catch(function(err) {
          throw err;
        });
      }), models.userTimesheets.scope({
        method: ['fetchOne', req.user.id, id]
      }).findOne()
    ]).then(function([result, timesheet]) {
      if (result && timesheet) {
        result.timesheets = [timesheet];
      }
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
