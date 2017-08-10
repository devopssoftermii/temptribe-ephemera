const ServerError = require('../lib/errors/ServerError');
const UnauthorizedError = require('../lib/errors/UnauthorizedError');

module.exports = function(app) {
  app.use(function(err, req, res, next) {
    if (req.match(/\/v2\//)) {
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
    } else {
      if (err.name && err.name === 'JsonWebTokenError') {
        err = new UnauthorizedError('token_invalid', {
          message: 'Invalid authorization token'
        });
      }
      var status = err.status || err.status_code || 500;
      if (process.env.NODE_ENV !== 'development' && status === 500) {
        err = new ServerError();
      }
      res.status(status).jsend(null, err).end();
    }
  });
}
