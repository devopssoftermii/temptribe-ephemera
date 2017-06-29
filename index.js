// Import config into process.env
require('dotenv-safe').config();

// Import Express
var express = require('express'),
    app     = express(),
    logging = require('./middleware/logging');

app.locals = Object.assign({}, app.locals, {
  logging: {
    sequelize: false
  }
});

// Initialise logging middleware
logging.before(app);

// Initialise DB
require('./data')(app);

if (process.env.NODE_ENV === 'development') {
  app.set('json spaces', 2);
  app.use('/static', express.static('static'));
}

// Pre-request logging
logging.before.forEach(function(middleware) {
  app.use(middleware);
});

// JSON parser
app.use(require('body-parser').json());

// App
app.use('/api/v2', require('./app'));

// Post-request error handling
logging.after(app);

// Create HTTP server and listen
const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost';
require('http').createServer(app).listen(port, host, function (err) {
  console.log(`
>>  Listening for requests on http://${host}:${port}
>>  Logging access requests locally, exceptions to Sentry if configured

Ready.
  `);
});
