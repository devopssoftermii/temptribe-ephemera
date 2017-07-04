var eventHelpers = require('../../../../util/events');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    models.eventShifts.findAndCountAll({
      include: [{
        model: models.events,
        where: {

        }
      }]
    });
    res.json(null);
  });
}
