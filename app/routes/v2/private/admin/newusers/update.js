const ClientError = require('../../../../../../lib/errors/ClientError');
const mailer = require('../../../../../../lib/mailer');
const userHelper = require('../../../../../../lib/user');

module.exports = function(router) {
  router.post('/update/:id', function(req, res, next) {
    var status = req.body.status.toLowerCase();
    if (!status || !status.match(/^pass|fail$/)) {
      throw new ClientError('no_result', {message: 'Missing pass / fail'});
    }
    var models = req.app.locals.models;
    return models.users.scope([
      'profile',
      'newRegistration'
    ]).findById(req.params.id).then(function(user) {
      if (!user) {
        throw new ClientError('no_user', {message: 'No such user'});
      }
      if (status === 'fail') {
        return user.update({
          status: 3
        }).then(function(result) {
          return mailer.send('applicationUnsuccessful', user.email, {
            firstname: user.firstname,
          });
        }).then(function(result) {
          return {
            result: 'User deleted'
          }
        });
      } else {
        return user.update({
          registrationStatus: 2
        }).then(function(result) {
          return mailer.send('newApplicant', user.email, {
            firstname: user.firstname,
            url: `${process.env.STAFF_APP_HOST}${process.env.STAFF_APP_RECRUIT_PATH}?i=${userHelper.generateURLHash(user, 'inviteToInterview')}`
          });
        }).then(function(result) {
          return {
            result: 'User invited to interview'
          }
        });
      }
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
