var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    if (['confirmed', 'applied', 'cancelled', 'history'].indexOf(req.params.status) === -1) {
      req.params.status = 'confirmed';
    }
    return models.eventShifts.scope([{
      method: ['staff', req.params.status === 'history'? 'past': 'future', 'minimal', req.user.id, req.params.status]
    }]).findAndCountAll().then(function(result) {
      var response = {
        total: result.count,
        shifts: result.rows
      };
      res.json(response);
    }).catch(function(err) {
      next(err);
    });
  });
}
