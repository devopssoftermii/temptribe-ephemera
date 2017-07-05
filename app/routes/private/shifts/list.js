var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var query = JSON.stringify(req.params);
    cache.pget(query).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope('staffFuture').findAndCountAll().then(function(result) {
        var shiftList = {
          total: result.count,
          shifts: result.rows.sort(eventHelpers.sortByShift)
        };
        return cache.pset(query, shiftList);
      });
    }).then(function(shiftList) {
      res.json(shiftList);
    }).catch(function(err) {
      res.status(500).json(null);
    });
  });
}
