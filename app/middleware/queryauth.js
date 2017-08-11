const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../lib/errors/UnauthorizedError');

module.exports = function(router, intent) {
  router.use(function(req, res, next) {
    try {
      var payload = jwt.verify(req.query.jwt, process.env.JWT_SECRET);
      if (!payload || !payload.user || !payload.intent || payload.intent !== intent) {
        throw new UnauthorizedError('token_invalid', {
          message: 'Invalid authorization token'
        });
      }
      req.user = payload.user;
      next();
    } catch (err) {
      next(err);
    }
  });
}
