module.exports = function(router) {
  router.get('/profile', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    models.users.scope('profile').findById(req.user.id).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
