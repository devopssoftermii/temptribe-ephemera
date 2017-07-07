var eventHelpers = require('../../../../lib/events');
var filterQuery = require('../../../../data/filters');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var filters = filterQuery(req, models);
    var key = JSON.stringify(filters.key);
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return Promise.all([
        models.eventShifts.scope([{
          method: ['staff', 'future', 'minimal']
        }]).count(filters.scope),
        models.eventShifts.scope([{
          method: ['staff', 'future', 'minimal']
        }]).findAll(filters.scope),
      ]).then(function(result) {
        var shifts = result[1].sort(eventHelpers.sortByShift());
        var response = {
          total: result[0],
          shifts
        };
        return cache.pset(key, response);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(response) {
      res.json(response);
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: {
        error: true,
        message: 'Failed to fetch shifts'
      });
    });
  });
}
