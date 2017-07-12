// Import config into process.env
require('dotenv-safe').config();

// Import Express
var express = require('express'),
    app     = express(),
    cache   = require('./lib/cache'),
    logging = require('./middleware/logging');

app.locals = Object.assign({}, app.locals, {
  sessionBlacklist: cache({
    stdTTL: parseInt(process.env.JWT_TTL, 10)
  }),
  shiftlistCache: cache({
    stdTTL: parseInt(process.env.SHIFTLIST_CACHE_TTL, 10)
  }),
});

// Initialise logging middleware
logging.before(app);

// Initialise DB
require('./data')(app);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
  app.use(process.env.API_PREFIX + '/static', express.static('static'));
}

// JSON parser
app.use(require('body-parser').json());

// App
var version = require('./package.json').version.split('.');
var apiPath = `${process.env.API_PREFIX}/v${version[0]}`;
app.use(apiPath, require('./app'));

// Post-request error handling
logging.after(app);

app.use(function(err, req, res, next) {
  if (process.env.NODE_ENV !== 'development') {
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  } else if (err instanceof Error) {
    res.status(500).json({
      name: err.name,
      message: err.message,
      stack: err.stack? err.stack: ''
    });
  }
});

// Create HTTP server and listen
const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost';
require('http').createServer(app).listen(port, host, function (err) {
  console.log(`
>>  Listening for requests on http://${host}:${port}${apiPath}
>>  Logging access requests locally, exceptions to Sentry if configured

Ready.
  `);
});
