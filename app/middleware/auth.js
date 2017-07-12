const UnauthorizedError = require('../../lib/errors/UnauthorizedError');
const ServerError = require('../../lib/errors/ServerError');

module.exports = function(router) {
  if (process.env.SKIP_LOGIN === 'true') {
    return;
  }
  router.use(require('express-jwt')({ secret: process.env.JWT_SECRET }));
  router.use(function(req, res, next) {
    return req.app.locals.sessionBlacklist.pget(req.headers.authorization.split(' ')[1]).then(function(value) {
      if (value !== undefined) {
        next(new UnauthorizedError('token_revoked', {message: 'Token has been revoked'}));
      } else {
        next();
      }
    });
  });
  router.use(function(req, res, next) {
    if (!req.user || !req.user.id) {
      next(new ServerError('failed_user', {message: 'Authenticated but no user set'}));
    } else {
      next();
    }
  });
}
