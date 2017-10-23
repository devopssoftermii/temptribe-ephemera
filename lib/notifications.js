module.exports = {
  send: function(models, to, title, body, data) {
    var actualSend = process.env.NOTIFICATIONS_DISABLE !== 'true';
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
          return user.recordNotification(notification);
        }));
      }).then(function(deviceLists) {
        var userIds = [];
        var deviceIds = deviceLists.reduce(function(a, b) {
          if (b.devices.length) {
            userIds.push(b.user.id);
          }
          return a.concat(b.devices);
        }, []).map(function(device) {
          return device.id;
        });
        var formatResponse = function() {
          return {
            userIds,
            deviceIds
          };
        }
        if (actualSend) {
          return fetch(process.env.MAILER_ENDPOINT + '/sendbatchnotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
            },
            body: JSON.stringify({
              id: notification.id,
              deviceIds,
              title,
              body,
              data
            })
          }).then(formatResponse);
        } else {
          formatResponse();
        }
      }).then(function(to) {
        return {
          sent: actualSend,
          to
        };
      });
    });
  }
};