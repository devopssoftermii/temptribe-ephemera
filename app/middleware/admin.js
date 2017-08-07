const UnauthorizedError = require('../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.use(function(req, res, next) {
    if (req.user.userTypeID !== 2) {
      next(new UnauthorizedError('no_access', {
        status: 403,
        message: 'You do not have access to this page'
      }));
    } else {
      next();
    }
  });
}
