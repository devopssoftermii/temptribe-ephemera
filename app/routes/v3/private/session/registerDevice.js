var session = require('../../../../middleware/session');
const ClientError = require('../../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.post('/registerdevice', function(req, res, next) {
    if (!req.body.token || !req.body.device || !req.body.type || !req.body.os) {
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
        var deviceInput = Object.assign({
          id: req.body.device
        }, req.body);
        return models.device.create(deviceInput).then(function(device) {
          register(device);
        });
      }
    }).catch(function(err) {
      next(err);
    });
  });
}
