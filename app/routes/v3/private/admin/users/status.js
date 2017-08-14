const ClientError = require('../../../../../../lib/errors/ClientError');
const mailer = require('../../../../../../lib/mailer');
const userHelper = require('../../../../../../lib/user');

const userStatuses = new Map([
  ['new', 0],
  ['active', 1],
  ['inactive', 2],
  ['deleted', 3]
]);

module.exports = function(router) {
  router.get('/status/:id', function(req, res, next) {
    var models = req.app.locals.models;
    return models.users.find({
      attributes: ['id', 'status'],
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      if (!user) {
        throw new ClientError('no_user', {message: 'No such user'});
      }
      res.jsend(user.status);
    }).catch(function(err) {
      next(err);
    });
  });
  router.post('/status/:id', function(req, res, next) {
    var status = req.body.status.toLowerCase();
    if (!status || !userStatuses.has(status)) {
      throw new ClientError('no_result', {message: 'Missing status'});
    }
    var models = req.app.locals.models;
    return models.users.find({
      attributes: ['id', 'status'],
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      if (!user) {
        throw new ClientError('no_user', {message: 'No such user'});
      }
      switch (status) {
        case 'active':
          return user.update({
            status: 1
          }).then(function(result) {
            return {
              result: 'User activated'
            }
          });
        case 'inactive':
          return user.update({
            status: 2
          }).then(function(result) {
            return {
              result: 'User marked for delete'
            }
          });
        case 'deleted':
          return user.update({
            status: 3
          }).then(function(result) {
            return {
              result: 'User deleted'
            }
          });
      }
    }).then(function(result) {
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
