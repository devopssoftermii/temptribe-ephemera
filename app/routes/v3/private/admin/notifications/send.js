const ClientError = require('../../../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.post('/send', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    if (!req.body || !req.body.to || !req.body.title || !req.body.body) {
      throw new ClientError('invalid_notification', {message: 'Missing notification data'});
    }
    if (!Array.isArray(req.body.to) || req.body.to.some(function(id) {
      return isNaN(parseInt(id));
    })) {
      throw new ClientError('invalid_notification', {message: 'Invalid to: data'});
    }
    models.notification.create({
      title: req.body.title,
      body: req.body.body
    }).then(function(notification) {
      return models.users.findAll({
        where: {
          id: {
            $in: req.body.to
          }
        },
      }).then(function(users) {
        return Promise.all(users.map(function(user) {
          if (!user) {
            return null;
          }
          return Promise.all([
            user.addNotification(notification),
            user.getApiSessions().then(function(sessions) {
              return Promise.all(sessions.map(function(session) {
                return session.getDevices().then(function(devices) {
                  return Promise.all(devices.map(function(device) {
                    return device.addNotification(notification);
                  }));
                });
              }));
            })
          ]).then(function() {
            return user;
          });
        })).then(function(users) {
          return users.filter(function(user) {
            return user !== null;
          });
        });
      });
    }).then(function(users) {
      res.jsend({
        sentTo: users
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
  