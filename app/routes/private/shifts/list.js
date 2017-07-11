var filterQuery = require('../../../../data/filters');

module.exports = function(router) {
  router.post('/list/:detail(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    if (['full', 'minimal', 'listonly'].indexOf(req.params.detail) === -1) {
      req.params.detail = 'minimal';
    }
    var filters = filterQuery(req, models);
    var key = JSON.stringify({
      detail: req.params.detail,
      filters: filters.key
    });
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope({
        method: ['staff', 'future', req.params.detail, filters.scope]
      }).findAndCountAll({
        distinct: true,
        col: 'eventShifts.id'
      }).then(function(result) {
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
