const ClientError = require('../../../../../lib/errors/ClientError');

getUserInterview = function(models, userId) {
  return models.userTrainingSessionApplications.findOne({
    where: {
      userID: userId,
      status: 4
    },
    include: [{
      model: models.trainingSessions,
      as: 'trainingSession',
      attributes: ['SessionDate', 'StartTime', 'EndTime']
    }],
  })
}

module.exports = function(router) {
  router.get('/interview', function(req, res, next) {
    return getUserInterview(req.app.locals.models, req.user.id).then(function(result) {
      res.jsend(result || []);
    }).catch(function(err) {
      next(err);
    });
  });

  router.post('/interview', function(req, res, next) {
    var models = req.app.locals.models;
    var trainingSessionID = req.body.trainingSessionID;
    return getUserInterview(models, req.user.id).then(function(result) {
      if (result) {
        throw new ClientError('already_booked', {
          message: 'You are already booked on an interview'
        });
      }
      return true;
    }).then(function() {
      return models.trainingSessions.findById(trainingSessionID);
    }).then((trainingSession) => {
      return trainingSession.full();
    }).then((full) => {
      if (full === true) {
        throw new ClientError('session_full', {
          message: 'This session is already fully booked'
        });
      }
      return true;
    }).then(function() {
      return models.userTrainingSessionApplications.create({
        UserID: req.user.id,
        TrainingSessionID: trainingSessionID,
        Status: 4,
      });
    }).then(function(result) {
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
