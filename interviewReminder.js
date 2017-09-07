// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');

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
    return Promise.all(results.map(function(session) {
      return Promise.all(session.userTrainingSessionApplications.map(function(application) {
        return new Promise(function(resolve, reject) {
          resolve({
            to: 'ashleigh+' + application.user.firstname + '@temptribe.co.uk',
            data: {
              firstname: application.user.firstname,
              date: session.SessionDate,
              time: session.StartTime
            }
          });
        });
      }));
    })).then(function(emails) {
      mailer.sendBatch('interviewReminder', emails).finally(function() {
        process.exit();
      });
    });
  }
});