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
        return Promise.all([user, user.getSuitabilityTypes()]);
      }
    }).then(function(results) {
      user = Object.assign({}, results[0], {
        suitabilityTypes: results[1]
      });
      return session.create(user, models);
    }).then(function(sessionResult) {
      res.json(sessionResult);
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: {
        success: false,
        error: 'Internal server error'
      });
    });
  });
}
