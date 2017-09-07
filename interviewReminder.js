// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');

var app = {};

// Initialise DB
require('./data')(app);
console.log(app.models)

const { sequelize, models } = app;
models.trainingSessions.find({
  attributes: ['id', 'SessionDate'],
  include: [{
    model: models.userTrainingSessionApplications,
    attributes: ['id', 'status'],
    where: {
      status: 4
    },
    required: false
  }],
  where: {
    SessionDate: sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate')))
  }
}).then(function(results) {
  results.forEach(function(session) {
    console.log(session.id);
  });
});