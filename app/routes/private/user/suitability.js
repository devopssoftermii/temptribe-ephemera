module.exports = function(router) {
  router.get('/suitability', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    Promise.all([
      models.suitabilityTypes.findAll(),
      models.users.scope('suitability').findById(req.user.id),
    ]).then(function(result) {
      let allTypes = new Set(result[0].map(a => a.get({ plain: true })));
      let userTypes = new Set(result[1].suitabilityTypes.map(b => b.get({ plain: true })));
      let intersection = new Set([...allTypes].filter(x => userTypes.has(x)));
      res.json([...intersection]);
    }).catch(function(err) {
      next(err);
    });
  });
}
