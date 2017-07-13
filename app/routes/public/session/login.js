var session = require('../../../middleware/session');
const UnauthorizedError = require('../../../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
      throw new UnauthorizedError('credentials_required', {message: 'Missing email or password'});
    }
    var models = req.app.locals.models;
    var sequelize = req.app.locals.sequelize;
    models.users.scope({ method: ['login', req.body] }).findOne().then(function(user) {
      if (!user) {
        throw new UnauthorizedError('unknown_credentials', {message: 'Unknown email or password'});
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
