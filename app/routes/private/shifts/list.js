var filterQuery = require('../../../../data/filters');
var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.post('/list', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
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
    var processRequest = function() {
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
        res.json(eventHelpers.formatShiftList(result, detail, pageInfo));
      }).catch(function(err) {
        next(err);
      });
    }
    if (process.env.FETCH_USER_FROM_JWT === 'false') {
      var userKey = JSON.stringify({
        userId: req.user.id,
        fields: ['favouritedBy', 'suitability']
      });
      return cache.pget(userKey).then(function(result) {
        if (result) {
          return result;
        }
        return models.users.scope('includeOnly').findById(req.user.id).then(function(result) {
          return Promise.all([
            result.getSuitabilityTypes(),
            result.getFavouritedBy()
          ]);
        }).then(function(userFields) {
          var plainFields = {
            suitabilityTypes: userFields[0].map(function(type) {
              return type.get({ plain: true });
            }),
            favouritedBy: userFields[1].map(function(client) {
              return client.get({ plain: true });
            }),
          };
          return cache.pset(userKey, plainFields);
        });
      }).then(function(plainFields) {
        return Object.assign(req.user, plainFields);
      }).then(processRequest);
    } else {
      return processRequest();
    }
  });
}
