module.exports = function(router) {
  router.get('/suitability', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    Promise.all([
      models.suitabilityTypes.findAll(),
      models.users.scope('includeOnly').findById(req.user.id),
    ]).then(function(result) {
      return Promise.all([
        result[0],
        result[1].getSuitabilityTypes()
      ]);
    }).then(function(result) {
      let userTypes = new Set(result[1].map(b => b.get({ plain: true }).id));
      res.json(result[0].map(a => {
        a = a.get({ plain: true });
        a.enabled = userTypes.has(a.id);
        return a;
      }));
    }).catch(function(err) {
      next(err);
    });
  });
}
