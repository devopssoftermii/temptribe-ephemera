var eventHelpers = require('../../../../lib/events');
var filterQuery = require('../../../../data/filters');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var filters = filterQuery(req, models);
    cache.pget(filters.key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope([{
        method: ['staff', 'future', 'minimal']
      }]).findAndCountAll(filters.scope).then(function(result) {
        var shiftList = {
          total: result.count,
          shifts: result.rows.sort(eventHelpers.sortByShift)
        };
        return cache.pset(filters.key, shiftList);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(shiftList) {
      res.json(shiftList);
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: {
        error: true,
        message: 'Failed to fetch shifts'
      });
    });
  });
}
