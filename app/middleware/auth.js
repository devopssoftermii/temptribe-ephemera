module.exports = function(router) {
  if (process.env.SKIP_LOGIN === 'true') {
    return;
  }
  router.use(require('express-jwt')({ secret: process.env.JWT_SECRET }));
  router.use(function(req, res, next) {
    return req.app.locals.sessionBlacklist.pget(req.headers.authorization.split(' ')[1]).then(function(value) {
      if (value !== undefined) {
        next(new Error('Token has been revoked'));
      } else {
        next();
      }
    });
  });
  router.use(function(err, req, res, next) {
    res.status(401).json(process.env.NODE_ENV === 'development'? err: {
      error: true,
      message: 'Authentication failed'
    }).end();
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
