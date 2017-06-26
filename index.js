var dotenv      = require('dotenv-safe'),
    http        = require('http'),
    app         = require('express')();

var logging = require('./middleware/logging');

// Import config into process.env
dotenv.config();

// Logging
if (logging.ravenHandler) {
  app.use(logging.ravenHandler);
}
app.use(logging.accessLogger);

// JSON parser
app.use(require('body-parser').json());

// App
app.use('/api/v2', require('./app'));

// Error handling
if (logging.errorHandler) {
  app.use(logging.errorHandler);
}

const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost';
http.createServer(app).listen(port, host, function (err) {
  console.log('Listening for requests on http://' + host + ':' + port);
});
