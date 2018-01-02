var eventHelpers = require('../../../../../lib/events');

module.exports = function(router) {
  router.get('/detail/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    var key = JSON.stringify({
      shiftId: id,
    });
    cache.getOrSet(key, function() {
      return models.eventShifts.scope({
        method: ['staff', 'full', req.user.blacklistedBy, 'future']
      }).findById(id).then(function(shift) {
        if (!shift) {
          return null;
        }
        return eventHelpers.formatShift(shift.get({ plain: true }), req.user.favouritedBy, full, true, true);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
