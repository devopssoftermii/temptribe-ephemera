var morgan = require('morgan'),
    rfs = require('rotating-file-stream'),
    path 			= require('path'),
    fs 				= require('fs');

module.exports = {
  before: [],
  after: []
};

// Sentry logging
var ravenLogger = null;
var errorLogger = null;
if (process.env.SENTRY_DSN) {
  var Raven = require('raven');
  Raven.config(process.env.SENTRY_DSN).install();
  Raven.captureMessage('Initialising Ephemera API', {
    level: 'info'
  });
  module.exports.before.push(Raven.requestHandler());
  module.exports.after.push(Raven.errorHandler());
}

// HTTP access logging
var logDir = process.env.LOGDIR || 'log';
fs.existsSync(logDir) || fs.mkdirSync(logDir);

module.exports.before.push(
  morgan('combined', {
    stream: rfs('access.log', {
      interval: '1d',
      path: logDir
    })
  })
);

module.exports.before.push(morgan('dev'));
