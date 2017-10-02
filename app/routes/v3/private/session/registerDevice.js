var session = require('../../../../middleware/session');
const UnauthorizedError = require('../../../../../lib/errors/UnauthorizedError');

module.exports = function(router) {
  router.post('/registerDevice', function(req, res, next) {
    if (!req.body.token || !req.body.device || !req.body.type || req.body.os) {
      throw new ClientError('invalid_credentials', { message: 'Invalid device credentials' });
    }
    var models = req.app.locals.models;
    var sequelize = req.app.locals.sequelize;
    return models.device.findById(req.body.device).then(function(device) {
      var register = function(device) {
        return session.registerDevice(req.body.token, device, models);
      }
      if (device) {
        return register(device);
      } else {
        return models.device.create(req.body).then(register(device));
      }
    }).catch(function(err) {
      next(err);
    });
  });
}
