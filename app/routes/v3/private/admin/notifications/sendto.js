const ClientError = require('../../../../../../lib/errors/ClientError');
const notifications = require('../../../../../../lib/notifications');

function validateString(...args) {
  return args.every(function(arg) {
    return typeof(arg) === 'string' && arg;
  });
}

module.exports = function(router) {
  router.post('/sendto', function(req, res, next) {
    var { to, title, body, format, data, icon } = req.body;
    data = data || null;
    icon = icon || null;
    if (!to || !validateString(title, body)) {
      throw new ClientError('invalid_notification', { message: 'Missing notification data' });
    }
    if (!Array.isArray(to)) {
      to = [to];
    }
    if (to.some(function(id) {
      return isNaN(parseInt(id));
    })) {
      throw new ClientError('invalid_notification', { message: 'Invalid to: data' });
    }
    // return notifications.send(req.app.locals.models, to, title, body, data, icon).then(function(result) {
    //   res.jsend(formatResponse(result, format));
    // }).catch(function(err) {
    //   next(err);
    // });
    return notifications.sendWithoutSaving(req.app.locals.models, req.app.locals.sequelize, to, title, body, data, icon).then(function(result) {
      res.jsend(formatResponse(result, format));
    }).catch(function(err) {
      next(err);
    });
  });
}

function formatResponse(response, format) {
  if ('object' !== typeof(response.to)) {
    return response;
  }
  if (!format || (format === 'users' && response.to.deviceIds)) {
    delete response.to.deviceIds;
  }
  if (format === 'devices' && response.to.userIds) {
    delete response.to.userIds;
  }
  return response;
}
