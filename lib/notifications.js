module.exports = {
  send: function(models, to, title, body) {
    return models.notification.create({
      title,
      body
    }).then(function(notification) {
      return models.users.findAll({
        attributes: ['id'],
        where: {
          id: {
            $in: to
          }
        },
      }).then(function(users) {
        return Promise.all(users.map(function(user) {
          if (!user) {
            return null;
          }
          return Promise.all([
            user.addNotification(notification),
            user.getDevices().then(function(devices) {
							return devices.map(function(device) {
								return device.addNotification(notification);              
							});
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
    });
	}
};