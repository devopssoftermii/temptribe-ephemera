const ServerError = require('../lib/errors/ServerError');

module.exports = function(app) {
  app.use(function(err, req, res, next) {
    var status = err.status || err.status_code || 500;
    if (process.env.NODE_ENV !== 'development' && status === 500) {
      err = new ServerError();
    }
    res.status(status).jsend(null, err).end();
  });
}
