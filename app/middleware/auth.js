const UnauthorizedError = require('../../lib/errors/UnauthorizedError');
const ServerError = require('../../lib/errors/ServerError');
const session = require('./session');

function fetchUser(models, id) {
  return models.users.scope('apiUser').findOne({
    where: {
      id
    }
  }).then(function(user) {
    if (user) {
      return session.buildTokenUser(user);
    } else {
      return user;
    }
  })
}

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
    var forceCheck = req.user.id > 0 && req.method.match(/^POST|PUT|PATCH|DELETE$/);
    if (forceCheck || process.env.FETCH_USER_FROM_JWT === 'false') {
      var models = req.app.locals.models;
      var cache = req.app.locals.apiUserCache;
      return new Promise(function(resolve, reject) {
        if (forceCheck) {
          return fetchUser(models, req.user.id).then(function(user) {
            resolve(user);
          });
        } else {
          var userKey = JSON.stringify({
            userId: req.user.id,
          });
          cache.pget(userKey).then(function(result) {
            if (result) {
              return result;
            }
            return fetchUser(models, req.user.id).then(function(user) {
              if (user) {
                return cache.pset(userKey, user);
              } else {
                return cache.pdel(userKey).then(function(count) {
                  return null;
                });
              }
            });
          }).then(function(user) {
            resolve(user);
          });
        }
      }).then(function(user) {
        req.user = user;
        next();
      });
    } else {
      next();
    }
  });
  router.use(function(req, res, next) {
    if (!req.user || !req.user.id) {
      next(new UnauthorizedError('failed_user_recheck', {message: 'No user set after user recheck'}));
    } else {
      next();
    }
  });
}
