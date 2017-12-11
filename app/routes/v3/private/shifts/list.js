var filterQuery = require('../../../../../data/filters');
var eventHelpers = require('../../../../../lib/events');

module.exports = function(router) {
  router.post('/list', function(req, res, next) {
    var models = req.app.locals.models;
    var cache = req.app.locals.shiftlistCache;
    var detail = 'standard';
    var page = 1;
    var after = null;
    if (req.body.detail && ['full', 'standard', 'metadata'].indexOf(req.body.detail) !== -1) {
      detail = req.body.detail;
    }
    if (req.body.page && 'number' === typeof(req.body.page)) {
      page = req.body.page;
    } else if (req.body.after && 'number' === typeof(req.body.after)) {
      after = req.body.after;
      page = null;
    }
    var filters = filterQuery(req, models);
    if (req.body.f && req.body.f.fav) {
      filters.key.favourite = true;
      filters.scope.favourite = req.user.favouritedBy;
    }
    var key = JSON.stringify({
      filters: filters.key,
      detail
    });
    var userKey = JSON.stringify({
      userShifts: req.user.id
    });
    return Promise.all([cache.getOrSet(key, function(result) {
      return models.eventShifts.scope({
        method: ['staff', detail, req.user.blacklistedBy, 'future', 'userBooked', filters.scope]
      }).findAll({
        distinct: true,
        col: 'eventShifts.id',
        where: {
          status: 1,
          Ambassador: {
            $or: [null, 0, req.user.ambassador]
          },
          Rating: {
            $or: [null, req.user.lolaRating]
          },
          Gender: {
            $or: [null, req.user.gender]
          },
        }
      }).then(function(result) {
        var unstaffedResults = result.filter(function(shift) {
          return shift.timesheets.length < shift.qty;
        })
        return {
          rows: unstaffedResults,
          count: unstaffedResults.length
        };
      }).catch(function(err) {
        throw err;
      });
    }), cache.pget(userKey).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope([{
        method: ['staff', 'metadata', req.user.blacklistedBy, 'future', req.user.id, 'active']
      }]).findAll({
        distinct: true,
        col: 'eventShifts.id'
      }).then(function(result) {
        return cache.pset(userKey, new Set(result.map(function(shift) {
          return shift.id;
        })));
      });
    })]).then(function([allShifts, userShifts]) {
      var filtered = allShifts.rows.filter(function(shift) {
        return !userShifts.has(shift.id);
      });
      return {
        rows: filtered,
        count: filtered.length
      }
    }).then(function(result) {
      var pageInfo = detail === 'metadata'? null: {
        page,
        limit: parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10),
        after
      }
      res.jsend(eventHelpers.formatShiftList(result, req.user.favouritedBy, detail, true, true, pageInfo));
    }).catch(function(err) {
      next(err);
    });
  });
}
