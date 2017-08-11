var morgan    = require('morgan'),
    rfs       = require('rotating-file-stream'),
    path 			= require('path'),
    fs 				= require('fs');
    Raven     = null;

if (process.env.SENTRY_DSN) {
  Raven = require('raven');
  Raven.config(process.env.SENTRY_DSN).install();
  Raven.captureMessage('Initialising Ephemera API', {
    level: 'info'
  });
}

module.exports = {
  before: function(app) {
    // Sentry logging
    if (Raven) {
      app.use(Raven.requestHandler());
    }

    // HTTP access logging
    var logDir = process.env.LOGDIR || 'log';
    fs.existsSync(logDir) || fs.mkdirSync(logDir);

    app.use(
      morgan('combined', {
        stream: rfs('access.log', {
          interval: '1d',
          path: logDir
        })
      })
    );
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
  },
  after: function(app) {
    // Sentry logging
    if (Raven) {
      ravenHandler = Raven.errorHandler();
      app.use(function(err, req, res, next) {
        if (err.name && err.name === 'JsonWebTokenError') {
          next();
        } else {
          ravenHandler(err, req, res, next);
        }
      });
    }
  }
}
