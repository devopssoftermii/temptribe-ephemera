module.exports = function(router) {
  router.get('/interview', function(req, res, next) {
    var models = req.app.locals.models;
    return models.userTrainingSessionApplications.findOne({
      where: {
        userID: req.user.id,
        status: 4
      },
      include: [{
        model: models.trainingSessions,
        as: 'trainingSession',
        attributes: ['SessionDate', 'StartTime', 'EndTime']
      }],
    }).then(function(result) {
      res.jsend(result || []);
    }).catch(function(err) {
      next(err);
    });
  });

  router.post('/interview', function(req, res, next) {
    var models = req.app.locals.models;
    var trainingSessionID = req.body.trainingSessionID
    return models.trainingSessions.findById(trainingSessionID).then((trainingSession) => trainingSession.full()).then((full) => {
      if (full === true) {
        return {
          result: 'session_full',
          trainingSessionID: trainingSessionID
        };
      } else {
        return models.userTrainingSessionApplications.create({
          UserID: req.user.id,
          TrainingSessionID: trainingSessionID,
          Status: 4,
        }).then((newRecord) => {
          return {
            result: 'created',
            newRecord
          };
        }).catch(function(err) {
          throw err;
        });
      }
    }).then(function(result) {
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
