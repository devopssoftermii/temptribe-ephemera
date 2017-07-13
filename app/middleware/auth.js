const UnauthorizedError = require('../../lib/errors/UnauthorizedError');
const ServerError = require('../../lib/errors/ServerError');

module.exports = function(router) {
  if (process.env.SKIP_LOGIN === 'true') {
    return;
  }
  router.use(require('express-jwt')({ secret: process.env.JWT_SECRET }));
  router.use(function(req, res, next) {
    return req.app.locals.sessionBlacklist.pget(req.headers.authorization.split(' ')[1]).then(function(value) {
      if (value !== undefined) {
        next(new UnauthorizedError('token_revoked', {message: 'Token has been revoked'}));
      } else {
        next();
      }
    });
  });
  router.use(function(req, res, next) {
    if (process.env.FETCH_USER_FROM_JWT === 'false') {
      var models = req.app.locals.models;
      var cache = req.app.locals.shiftlistCache;
      var userKey = JSON.stringify({
        userId: req.user.id,
        fields: ['favouritedBy', 'suitability']
      });
      cache.pget(userKey).then(function(result) {
        if (result) {
          return result;
        }
        return models.users.scope('includeOnly').findById(req.user.id).then(function(result) {
          return Promise.all([
            result.getSuitabilityTypes(),
            result.getFavouritedBy()
          ]);
        }).then(function(userFields) {
          var plainFields = {
            suitabilityTypes: userFields[0].map(function(type) {
              return type.get({ plain: true });
            }),
            favouritedBy: userFields[1].map(function(client) {
              return client.get({ plain: true });
            }),
          };
          return cache.pset(userKey, plainFields);
        });
      }).then(function(plainFields) {
        return Object.assign(req.user, plainFields);
      }).then(function() {
        next();
      });
    } else {
      next();
    }
  });
  router.use(function(req, res, next) {
    if (!req.user || !req.user.id) {
      next(new ServerError('failed_user', {message: 'Authenticated but no user set'}));
    } else {
      next();
    }
  });
}
