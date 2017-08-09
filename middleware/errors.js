module.exports = function(app) {
  app.use(function(err, req, res, next) {
    var status = err.status || err.status_code || 500;
    var stack = err.stack || null;
    var name = err.name || 'ServerError';
    var code = err.code || 'internal_error';
    if (process.env.NODE_ENV !== 'development') {
      res.status(status).json({
        error: true,
        message: status === 500? 'Internal server error': err.message,
        code
      }).end();
    } else if (err instanceof Error) {
      res.status(status).json({
        error: true,
        name,
        message: err.message,
        code,
        stack
      }).end();
    } else {
      res.status(status).json(err).end();
    }
  });
}
