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
        return session.buildTokenUser(user);
      }
    }).then(function(user) {
      return session.create(user, models);
    }).then(function(sessionResult) {
      res.json(sessionResult);
    }).catch(function(err) {
      next(err);
    });
  });
}
