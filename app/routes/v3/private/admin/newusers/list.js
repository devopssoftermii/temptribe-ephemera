module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var models = req.app.locals.models;
    var count = parseInt(req.query.count, 10);
    if (isNaN(count) || !count) {
      count = 1;
    }
    var scopes = [
      'profile',
      'newRegistration'
    ];
    if (process.env.INVITE_TEST_MODE === 'true') {
      scopes.push('testOnly');
    }
    return models.users.scope(scopes).findAndCountAll({
      limit: count
    }).then(function(results) {
      res.jsend(results);
    }).catch(function(err) {
      next(err);
    });
  });
}
