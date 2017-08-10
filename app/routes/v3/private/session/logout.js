var session = require('../../../../middleware/session');
const UnauthorizedError = require('../../../../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.post('/logout', function(req, res, next) {
    if (!req.body.token) {
      throw new UnauthorizedError('missing_refresh_token', {message: 'Missing refresh token'});
    }
    return session.destroy(req.body.token, req.app.locals.models).then(function(logoutResult) {
      return req.app.locals.sessionBlacklist.pset(req.headers.authorization.split(' ')[1], true);
    }).then(function(token) {
      res.json({
        success: true
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
