var session = require('../../../middleware/session');

module.exports = function(router) {
  router.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      res.status(401).json({
        success: false,
        error: 'Missing email or password'
      });
      return;
    }
    var models = req.app.locals.models;
    var sequelize = req.app.locals.sequelize;
    models.users.scope({ method: ['login', req.body] }).findOne().then(function(user) {
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Unknown user or password'
        });
      } else {
        return Promise.all([user.get({ plain: true }), user.getSuitabilityTypes()]);
      }
    }).then(function(results) {
      user = Object.assign(results[0], {
        suitabilityTypes: results[1].map(function(type) {
            return type.get({ plain: true });
        })
      });
      return session.create(user, models);
    }).then(function(sessionResult) {
      res.json(sessionResult);
    }).catch(function(err) {
      next(err);
    });
  });
}
