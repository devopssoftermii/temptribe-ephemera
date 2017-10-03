module.exports = {
  send: function(models, to, title, body) {
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
				var deviceIDs = deviceLists.reduce(function(a, b) {
					return a.concat(b);
				}, []).map(function(device) {
					return device.id;
				});
				if (actualSend) {
					return fetch(process.env.MAILER_ENDPOINT + '/sendbatchnotification', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
						},
						body: JSON.stringify({
							id: notification.id,
							deviceIDs,
							title,
							body
						})
					}).then(function(result) {
						return deviceIDs;
					});
				} else {
					return deviceIDs;
				}
			}).then(function(deviceIDs) {
				return {
					sent: actualSend,
					to: deviceIDs
				};
			});
    });
	}
};