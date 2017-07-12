module.exports = function(router) {
  router.post('/detail/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    var key = JSON.stringify({
      shiftId: id,
    });
    cache.pget(key).then(function(result) {
      if (result) {
        return result;
      }
      return models.eventShifts.scope({
        method: ['staff', 'full', 'future']
      }).findById(id).then(function(result) {
        if (!result) {
          return null;
        }
        return cache.pset(key, result);
      }).catch(function(err) {
        throw err;
      });
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
