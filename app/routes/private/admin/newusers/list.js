module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var models = req.app.locals.models;
    var count = req.params.count;
    if (!count) {
      count = 1;
    }
    return models.users.scope([
      'profile',
      'newRegistration'
    ]).findAndCountAll({
      limit: count
    }).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });
}
