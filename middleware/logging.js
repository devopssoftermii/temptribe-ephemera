var morgan = require('morgan'),
    rfs = require('rotating-file-stream'),
    path 			= require('path'),
    fs 				= require('fs');

module.exports = {};

// Sentry logging
if (process.env.SENTRY_DSN) {
  var Raven = require('raven');
  Raven.config(process.env.SENTRY_DSN).install();
  Raven.captureMessage('Initialising Ephemera API', {
    level: 'info'
  });
  module.exports.ravenHandler = Raven.requestHandler();
  module.exports.errorHandler = Raven.errorHandler();
}

// HTTP access logging
var logDir = process.env.LOGDIR || 'log';
fs.existsSync(logDir) || fs.mkdirSync(logDir);
var accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDir
});
module.exports.accessLogger = morgan('combined', {
  stream: accessLogStream
});
