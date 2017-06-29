module.exports = function(router) {
  if (process.env.SKIP_LOGIN === 'true') {
    return;
  }
  router.use(require('express-jwt')({ secret: process.env.JWT_SECRET }));
  router.use(function(err, req, res, next) {
    res.status(401).json({
      error: true,
      message: err.message
    });
  });
  router.use(function(req, res, next) {
    if (!req.user || !req.user.id) {
      res.status(500).json({
        error: true,
        message: 'Authenticated but no user set - something has gone wrong'
      });
    } else {
      next();
    }
  });
}
