var filterQuery = require('../../../../data/filters');
var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/list/:detail(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var detail = req.params.detail;
    var after = null;
    var limit = parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10);
    if (['full', 'minimal', 'listonly'].indexOf(detail) === -1) {
      detail = 'minimal';
    }
    if (req.body.after && 'number' === typeof(req.body.after)) {
      after = req.body.after;
    }
    var filters = filterQuery(req, models);
    var key = JSON.stringify({
      filters: filters.key,
      detail,
    });
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope({
        method: ['staff', 'future', detail, filters.scope]
      }).findAndCountAll({
        distinct: true,
        col: 'eventShifts.id'
      }).then(function(result) {
        return cache.pset(key, result);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(result) {
      var lowerBound = 0;
      if (after) {
        lowerBound = result.rows.findIndex(function(shift) {
          return shift.id === after;
        }) + 1;
      }
      res.json({
        total: result.count,
        shifts: result.rows.slice(lowerBound, lowerBound + limit).map(function(shift) {
          return eventHelpers.formatShift(shift.get({ plain: true }), detail);
        })
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
