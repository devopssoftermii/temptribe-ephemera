var filterQuery = require('../../../../data/filters');
var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/list', function(req, res, next) {
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var detail = 'standard';
    var page = 1;
    var after = null;
    if (req.body.detail && ['standard', 'metadata'].indexOf(req.body.detail) !== -1) {
      detail = req.body.detail;
    }
    if (req.body.page && 'number' === typeof(req.body.page)) {
      page = req.body.page;
    } else if (req.body.after && 'number' === typeof(req.body.after)) {
      after = req.body.after;
      page = null;
    }
    var filters = filterQuery(req, models);
    var key = JSON.stringify({
      filters: filters.key,
      detail
    });
    return cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope({
        method: ['staff', detail, 'future', filters.scope]
      }).findAndCountAll({
        distinct: true,
        col: 'eventShifts.id'
      }).then(function(result) {
        return cache.pset(key, result);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(result) {
      var pageInfo = detail === 'metadata'? null: {
        page,
        limit: parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10),
        after
      }
      var favourites = req.user.favouritedBy.map(function(client) {
        return client.id;
      });
      res.json(eventHelpers.formatShiftList(result, favourites, detail, pageInfo));
    }).catch(function(err) {
      next(err);
    });
  });
}
