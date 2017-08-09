const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.use(function(req, res, next) {
    try {
      req.user = jwt.verify(req.query.jwt, process.env.JWT_SECRET);
      next();
    } catch (err) {
      next(err);
    }
  });
}
