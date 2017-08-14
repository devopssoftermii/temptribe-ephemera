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
    var status = 'string' === typeof(req.body.status) && req.body.status.toLowerCase();
    if (!status || !userStatuses.has(status)) {
      throw new ClientError('no_result', {message: 'Missing status'});
    }
    var models = req.app.locals.models;
    var sequelize = req.app.locals.sequelize;
    return models.users.find({
      attributes: [
        'id',
        'firstname',
        'status',
        'email',
        'userGUID',
        'registrationStatus'
      ],
      where: {
        id: req.params.id
      }
    }).then(function(user) {
      if (!user) {
        throw new ClientError('no_user', {message: 'No such user'});
      }
      switch (status) {
        case 'active':
          var updateUser = function() {
            return user.update({
              previousStatus: user.status,
              status: 1,
              registrationStatus: 4,
              ChangePasswordAtNextLogon: 0,
              StatusChangeDate: sequelize.fn('convert', sequelize.literal('date'), sequelize.fn('getdate'))
            }).then(function(result) {
              return {
                result: 'User activated'
              }
            });
          }
          if (user.status === 0) {
            return mailer.send('accountActive', user.email, {
              firstname: user.firstname,
              userguid: user.userGUID
            }).then(updateUser);
          } else {
            return updateUser();
          }
        case 'inactive':
          return user.update({
            previousStatus: user.status,
            status: 2,
            StatusChangeDate: moment.utc()
          }).then(function(result) {
            return {
              result: 'User marked for deletion'
            }
          });
        case 'deleted':
          return user.update({
            previousStatus: user.status,
            status: 3,
            StatusChangeDate: moment.utc()
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
