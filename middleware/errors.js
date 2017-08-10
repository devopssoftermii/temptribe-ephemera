const ServerError = require('../lib/errors/ServerError');
const UnauthorizedError = require('../lib/errors/UnauthorizedError');

module.exports = function(app) {
  app.use(function(err, req, res, next) {
    var status = err.status || err.status_code || 500;
    if (process.env.NODE_ENV !== 'development' && status === 500) {
      err = new ServerError();
    }
    if (err.name && err.name === 'JsonWebTokenError') {
      err = new UnauthorizedError('token_invalid', {
        message: 'Invalid token'
      });
    }
    res.status(status).jsend(null, err).end();
  });
}
