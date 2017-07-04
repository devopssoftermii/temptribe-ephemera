var eventHelpers = require('../../../../util/events');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    cache.pget('{}').then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope('staffFuture').findAndCountAll().then(function(result) {
        return Promise.all([result, cache.pset('{}', result)]);
      }).then(function(promises) {
        return promises[0];
      });
    }).then(function(result) {
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
