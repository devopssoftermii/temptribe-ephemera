var eventHelpers = require('../../../../util/events');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    models.eventShifts.scope('staffFuture').findAndCountAll().then(function(result) {
      if (result) {
        res.json({
          total: result.count,
          shifts: result.rows.sort(eventHelpers.sortByShift)
        });
      } else {
        res.json({
          total: 0,
          shifts: []
        });
      }
    }).catch(function(err) {
      res.status(500).json(null);
    });
  });
}
