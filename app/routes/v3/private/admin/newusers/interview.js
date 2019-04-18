const ClientError = require('../../../../../../lib/errors/ClientError');
const userHelper = require('../../../../../../lib/user');

module.exports = function(router) {
    router.get('/get-url/:id', function(req, res, next) {

        var models = req.app.locals.models;
        return models.users.scope([
            'profile',
            'newRegistration'
        ]).findById(req.params.id).then(function (user) {
            if (!user) {
                throw new ClientError('no_user', {message: 'No such user'});
            }
            return {
                url: `${process.env.STAFF_APP_HOST}${process.env.STAFF_APP_RECRUIT_PATH}?i=${userHelper.generateURLHash(user, 'inviteToInterview')}`
            }

        }).then(function(result) {
            res.jsend(result);
        }).catch(function(err) {
            next(err);
        });
    })
};