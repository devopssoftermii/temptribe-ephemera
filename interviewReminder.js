// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');

var app = {};

// Initialise DB
require('./data')(app);

const { sequelize, models } = app.locals;
models.trainingSessions.findAll({
  attributes: ['id'],
  where: {
    SessionDate: {
      $gte: sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
      $lt: sequelize.fn('dateadd', sequelize.literal('DAY'), 2, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
    }
  }
}).then(function(results) {
  if (results) {
    results.forEach(function(session) {
      console.log(session.id);
    });
  }
  process.exit();
});