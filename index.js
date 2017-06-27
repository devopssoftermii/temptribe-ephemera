// Import config into process.env
require('dotenv-safe').config();

// Import Express and middleware
var logging = require('./middleware/logging'),
    app     = require('express')();

app.locals = Object.assign({}, app.locals, require('./data'));
console.log(app.locals.models);

// Pre-request logging
logging.before.forEach(function(middleware) {
  app.use(middleware);
});

// JSON parser
app.use(require('body-parser').json());

// App
app.use('/api/v2', require('./app'));

// Post-request error handling
logging.after.forEach(function(middleware) {
  app.use(middleware);
});

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
