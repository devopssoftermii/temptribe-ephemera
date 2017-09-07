// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');

var app = {};

// Initialise DB
require('./data')(app);

const { sequelize, models } = app.locals;
models.trainingSessions.scope('future').findAll().then(function(results) {
  results.forEach(function(session) {
    console.log(session.id);
  });
});