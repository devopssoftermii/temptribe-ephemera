// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');
const moment = require('moment');

var app = {};

// Initialise DB
require('./data')(app);

const { sequelize, models } = app.locals;
models.trainingSessions.findAll({
  attributes: ['ID', 'SessionDate', 'StartTime'],
  include: [{
    model: models.userTrainingSessionApplications,
    include: [{
      model: models.users,
      as: 'user',
      attributes: ['email', 'firstname'],
      required: true
    }],
    required: true,
  }],
  where: {
    SessionDate: {
      $gte: sequelize.fn('dateadd', sequelize.literal('DAY'), 1, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
      $lt: sequelize.fn('dateadd', sequelize.literal('DAY'), 2, sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))),
    }
  }
}).then(function(results) {
  if (results) {
    var emails = [];
    results.forEach(function(session) {
      session.userTrainingSessionApplications.forEach(function(application) {
        emails.push({
          to: application.user.email,
          data: {
            firstname: application.user.firstname,
            time: moment(session.StartTime).format('hha')
          }
        });
      });
    })
    mailer.sendBatch('interviewReminder', emails).then(function() {
      process.exit();
    }).catch(function() {
      process.exit();
    });
  } else {
    process.exit();
  }
});