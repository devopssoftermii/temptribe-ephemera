var morgan = require('morgan'),
    rfs = require('rotating-file-stream'),
    path 			= require('path'),
    fs 				= require('fs');

// Sentry logging
var Raven = null;
if (process.env.SENTRY_DSN) {
  var Raven = require('raven');
  Raven.config(process.env.SENTRY_DSN).install();
  Raven.captureMessage('Initialising Ephemera API', {
    level: 'info'
  });
}

// HTTP access logging
var logDir = process.env.LOGDIR || 'log';
fs.existsSync(logDir) || fs.mkdirSync(logDir);
var accessLogger = morgan('combined', {
  stream: rfs('access.log', {
    interval: '1d',
    path: logDir
  })
})

module.exports = {
  before: function(req, res, next) {
    if (Raven) {
      Raven.requestHandler()(req, res, next);
    }
    accessLogger(req, res, next);
  },
  after: function(req, res, next) {
    if (Raven) {
      Raven.errorHandler()(req, res, next);
    }
  }
};
