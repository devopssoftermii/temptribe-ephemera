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
          return user.recordNotification(notification).then(function() {
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