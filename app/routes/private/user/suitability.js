module.exports = function(router) {
  router.get('/suitability', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    Promise.all([
      models.suitabilityTypes.findAll(),
      models.users.scope('suitability').findById(req.user.id),
    ]).then(function(result) {
      let allTypes = new Set(result[0]);
      let userTypes = new Set(result[1].suitabilityTypes);
      let intersection = new Set([...allTypes].filter(x => userTypes.has(x)));
      console.log(intersection);
    }).catch(function(err) {
      next(err);
    });
  });
}
