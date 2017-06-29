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

var options = {
  sequelize: function(message) {
    if (!process.env.DB_VERBOSE === 'true') {
      console.log('>>> DB: ' + message);
    }
  }
};

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

    app.locals = Object.assign({}, app.locals, {
      logging: options
    });
  },
  after: function(app) {
    // Sentry logging
    if (Raven) {
      app.use(Raven.errorHandler());
    }
  }
}
