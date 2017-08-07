module.exports = function(router) {
  router.get('/next', function(req, res, next) {
    var models = req.app.locals.models;
    return models.users.scope([
      'profile',
      'newRegistration'
    ]).findAll({
      limit: 1
    }).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });
}
