var eventHelpers = require('../../../../lib/events');
var filterQuery = require('../../../../data/filters');

module.exports = function(router) {
  router.post('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var filters = filterQuery(req, models);
    var key = JSON.stringify(filters.key);
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope([{
        method: ['staff', 'future', 'minimal']
      }]).findAndCountAll(filters.scope).then(function(result) {
        var response = {
          total: result.count,
          shifts: result.rows
        };
        return cache.pset(key, response);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(response) {
      res.json(response);
    }).catch(function(err) {
      next(err);
    });
  });
}
