var session = require('../../../../middleware/session');
const UnauthorizedError = require('../../../../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.post('/refresh', function(req, res, next) {
    if (!req.body.token) {
      throw new UnauthorizedError('missing_refresh_token', {message: 'Missing refresh token'});
    }
    return session.refresh(req.body.token, req.app.locals.models).then(function(refreshResult) {
      res.json(refreshResult);
    }).catch(function(err) {
      next(err);
    });
  });
}
