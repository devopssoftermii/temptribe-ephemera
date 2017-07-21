var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/apply/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'standard', 'future', req.user.id]
    }).findById(id).then(function(shift) {
      if (!shift) {
        return null;
      }
      var favourites = req.user.favouritedBy.map(function(client) {
        return client.id;
      });
      return eventHelpers.formatShift(shift.get({ plain: true }), favourites);
    }).then(function(shift) {
      res.json(shift);
    }).catch(function(err) {
      next(err);
    });
  });
}
