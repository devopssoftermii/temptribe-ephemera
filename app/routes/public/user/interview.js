var jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../../../lib/errors/UnauthorizedError');
var moment = require('moment');

module.exports = function(router) {
  router.get('/interview', function(req, res, next) {
    var jwToken = req.query.jwt
    var models = req.app.locals.models;

    jwt.verify(jwToken, process.env.JWT_SECRET, function(err, decoded) {
      if (err === null && decoded.id) {
        var userID = decoded.id
        userID = 255205
        console.log('userid is:' + userID)
        return models.userTrainingSessionApplications
        .findOne({
          where: {
            userID: userID,
            status: 4
          },
          include: [{
            model: models.trainingSessions,
            as: 'trainingSession',
            attributes: ['SessionDate', 'StartTime', 'EndTime']
          }],
        })
        .then(function(result) {
          var response = []
          if (result !== null) {
            response = result
          }
          res.json(response);
        }).catch(function(err) {
          next(err);
        });
      } else {
        return res.json(new UnauthorizedError('invalid_token', {message: 'Invalid token'}));
      }
    });
  });

  router.post('/interview', function(req, res, next) {
    var jwToken = req.query.jwt
    var models = req.app.locals.models;
    var trainingSessionID = req.body.trainingSessionID
    var jwtDecoded = null
    new Promise(function(resolve,reject) {
      jwt.verify(jwToken, process.env.JWT_SECRET, function(err, decoded) {
        if(err === null) {
          resolve(decoded)
        } else {
          reject(err)
        }
      });
    })
    .then(decoded => {
      jwtDecoded = decoded
      return models.trainingSessions.findById(trainingSessionID)
    }).then(trainingSession => {
      return  trainingSession.full()
    }).then(full => {
        if(full === true) {
          res.json({result: 'session_full', trainingSessionID: trainingSessionID});
        } else {
          models.userTrainingSessionApplications.create({
            UserID: jwtDecoded.id,
            TrainingSessionID: trainingSessionID,
            Status: 4,
          }).then(newUserTrainingSessionApplication => {
            res.json({result: 'created', newRecord: newUserTrainingSessionApplication});
          }).catch(function(err) {
            next(err);
          });
        }
    }).catch(function(err) {
      if(err instanceof JsonWebTokenError ){
        return res.json(new UnauthorizedError('invalid_token', {message: 'Invalid token'}));
      } else {
        next(err);
      }
    });
  });
}
