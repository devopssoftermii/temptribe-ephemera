var jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.get('/list', function(req, res, next) {
    var jwToken = req.query.jwt
    var models = req.app.locals.models;
    var jwtVerifyResult =

    jwt.verify(jwToken, process.env.JWT_SECRET, function(err, decoded) {
      if (err === null) {
        return models.trainingSessions.scope(['future'])
        .findAll({
          include: [{
            model: models.userTrainingSessionApplications,
            attributes: ['id','status'],
            where: {status: 4},
            required: false
          }],
        })
        .then(function(result) {
          res.json(result);
        }).catch(function(err) {
          next(err);
        });
      } else {
        return res.json(new UnauthorizedError('invalid_token', {message: 'Invalid token'}));
      }
    });

  });
}
