// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');

// Import Express
var express = require('express'),
    app     = express(),
    cache   = require('./lib/cache'),
    logging = require('./middleware/logging'),
    errors  = require('./middleware/errors');

app.locals = Object.assign({}, app.locals, {
  sessionBlacklist: cache({
    stdTTL: parseInt(process.env.JWT_TTL, 10)
  }),
  shiftlistCache: cache({
    stdTTL: parseInt(process.env.SHIFTLIST_CACHE_TTL, 10)
  }),
  apiUserCache: cache({
    stdTTL: parseInt(process.env.USER_CACHE_TTL, 10)
  }),
});

// Initialise logging middleware
logging.before(app);

// Initialise DB
require('./data')(app.locals);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
  app.use(process.env.API_PREFIX + '/static', express.static('static'));
}
app.set('trust proxy', true);

// JSON parser
app.use(require('body-parser').json());

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN? process.env.CORS_ORIGIN: '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.send();
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  res.jsend = function(body, err = null) {
    if (err) {
      if (err instanceof ClientError) {
        return res.json({
          status: 'fail',
          data: err
        });
      } else {
        return res.json({
          status: 'error',
          message: err.message,
          code: err.code,
          data: err
        });
      }
    } else {
      return res.json({
        status: 'success',
        data: body
      });
    }
  }
  next();
})

// App
app.use(process.env.API_PREFIX, require('./app'));

// Post-request error handling
logging.after(app);
errors(app);

// Create HTTP server and listen
const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost';
require('http').createServer(app).listen(port, host, function (err) {
  console.log(`
>>  Listening for requests on http://${host}:${port}${process.env.API_PREFIX}
>>  Logging access requests locally, exceptions to Sentry if configured

Ready.
  `);
});
