var ClientError = require('../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.post('/apply/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'standard', 'future', req.user.id]
    }).findById(id).then(function(shift) {
      if (shift) {
        throw new ClientError('already_booked', { message: 'You are already booked on this shift!' });
      }
      var favourites = req.user.favouritedBy.map(function(client) {
        return client.id;
      });
    }).then(function() {
      res.json({
        message: 'not booked'
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
