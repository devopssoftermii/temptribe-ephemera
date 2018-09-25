module.exports = {
  send: function(models, to, title, body, data, icon) {
    var actualSend = process.env.NOTIFICATIONS_DISABLE !== 'true';
    return models.notification.create({
      title,
      body,
      data,
      icon
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
              data,
              icon
            })
          }).then(formatResponse);
        } else {
          return formatResponse();
        }
      }).then(function(to) {
        return {
          sent: actualSend,
          to
        };
      });
    });
  },
  sendWithoutSaving: function(models, sequelize, to, title, body, data, icon) {
    var actualSend = process.env.NOTIFICATIONS_DISABLE !== 'true';
    return models.notification.create({
      title,
      body,
      data,
      icon
    }).then(function(notification) {
      return sequelize.query(
        'select u.id, api.deviceId from users u join apiSession api on api.userId = u.id where u.id IN (:userIds) AND api.deviceId IS NOT NULL',
        { replacements: { userIds: to }, type: sequelize.QueryTypes.SELECT }
      ).then(results => {
        //results = [{id: 124, deviceId: 'wadawdwadawda'}, {id: 124, deviceId: 'wadawdwadawda'}] an array of objects with userId and deciveId
        var deviceIds =  results.map(function(i) {return i.deviceId;})
        if (actualSend) {
          try {
            console.log('NOTIFICATION-' + notification.id + 'About to send request to queue /sendbatchnotification => deviceIds count=' + deviceIds.length);
          }
          catch (e) {
            console.log(e)
          }
          return fetch(process.env.MAILER_ENDPOINT + '/sendbatchnotification' , {
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
              data,
              icon
            })
          }).then(function(response) {
            response.json().then(function(data) {
              console.log('NOTIFICATION-' + notification.id + 'Result from /sendbatchnotification');
              console.log('result=' + data.results);
              console.log('errors count=' + data.errors.length);
            }).catch(function(err) {console.log(err);});
            return {
              userIds: to,
              deviceIds
            };
          });
        } else {
          return {
            userIds: to,
            deviceIds
          };
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