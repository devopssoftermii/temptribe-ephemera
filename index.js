var logging = require('./middleware/logging'),
    app     = require('express')();

// Import config into process.env
require('dotenv-safe').config();

// Logging
app.use(logging.before);

// JSON parser
app.use(require('body-parser').json());

// App
app.use('/api/v2', require('./app'));

// Error handling
app.use(logging.after);

const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost';
require('http').createServer(app).listen(port, host, function (err) {
  console.log('Listening for requests on http://' + host + ':' + port);
});
