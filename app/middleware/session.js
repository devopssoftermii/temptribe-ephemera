var jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../lib/errors/UnauthorizedError');
const ServerError = require('../../lib/errors/ServerError');

function extractSessionFromToken(token, models) {
  return new Promise(function(resolve, reject) {
    try {
      resolve(jwt.verify(token, process.env.JWT_SECRET));
    } catch (ex) {
      reject(new UnauthorizedError('invalid_refresh', {message: 'Invalid refresh token'}));
    }
  }).then(function(payload) {
    return models.apiSession.findOne({
      where: {
        id: payload.id
      },
      include: [{
        model: models.users,
        attributes: [
          'id',
          'email'
        ],
        required: true
      }]
    });
  }).then(function(session) {
    if (!session) {
      throw new UnauthorizedError('invalid_session', {message: 'Invalid session'});
    }
    return session;
  })
}

module.exports = {
  create: function(user, models) {
    return models.apiSession.create({ userId: user.id }).then(function(session) {
      return {
        success: true,
        userId: user.id,
        access: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
        refresh: jwt.sign(session.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: '1y' })
      }
    }).catch(function(err) {
      throw err;
    });
  },
  buildTokenUser: function(user) {
    return Promise.all([
      user.get({ plain: true }),
      user.getSuitabilityTypes(),
      user.getFavouritedBy()
    ]).then(function([user, types, favouritedBy]) {
      return Object.assign(user, {
        suitabilityTypes: types.map(function(type) {
          return type.get({ plain: true });
        }),
        favouritedBy: favouritedBy.map(function(client) {
          return client.get({ plain: true });
        }),
      });
    });
  },
  destroy: function(token, models) {
<<<<<<< HEAD
    return new Promise(function(resolve, reject) {
      try {
        resolve(jwt.verify(token, process.env.JWT_SECRET));
      } catch (ex) {
        reject(new UnauthorizedError('invalid_refresh', {message: 'Invalid refresh token'}));
      }
    }).then(function(payload) {
      return models.apiSession.findOne({
        where: {
          id: payload.id
        },
        include: [{
          model: models.users,
          attributes: [
            'id', 'email'
          ],
          required: true
        }]
      });
    }).then(function(result) {
      if (!result) {
        throw new UnauthorizedError('invalid_session', {message: 'Invalid session'});
      }
      var user = result.user;
      return Promise.all([module.exports.buildTokenUser(user), result.destroy()]);
    }).then(function([user, destroyResult]) {
      return user;
=======
    return extractSessionFromToken(token, models).then(function(session) {
      return session.destroy();
>>>>>>> 754bd94ae9a9ca29f3134ccef2f7f22d42f5319d
    }).catch(function(err) {
      throw err;
    });
  },
  refresh: function(token, models) {
    return extractSessionFromToken(token, models).then(function(session) {
      var user = session.user.get({ plain: true });
      return {
        success: true,
        userId: user.id,
        access: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) })
      }
    }).catch(function(err) {
      throw err;
    });
  }
};


