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
        model: models.users.scope('apiUser'),
        required: true
      }]
    });
  }).then(function(session) {
    if (!session) {
      throw new UnauthorizedError('invalid_session', {message: 'Invalid session'});
    }
    return session;
  }).catch(function(err) {
    throw err;
  });
}

function buildTokenUser(user) {
  return Promise.all([
    user.get({ plain: true }),
    user.getSuitabilityTypes(),
    user.getFavouritedBy(),
    user.getBlacklistedBy(),
  ]).then(function([user, types, favouritedBy, blacklistedBy]) {
    return Object.assign(user, {
      suitabilityTypes: types.map(function(type) {
        return type.get({ plain: true });
      }),
      favouritedBy: favouritedBy.map(function(client) {
        return client.get({ plain: true }).id;
      }),
      blacklistedBy: blacklistedBy.map(function(client) {
        return client.get({ plain: true }).id;
      }),
    });
  });
}

module.exports = {
  buildTokenUser,
  create: function(user, models) {
    return Promise.all([
      buildTokenUser(user),
      models.apiSession.create({ userId: user.get('id') })
    ]).then(function([user, session]) {
      return {
        success: true,
        userId: user.id,
        admin: user.userTypeID === 2,
        access: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
        refresh: jwt.sign(session.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: '1y' })
      }
    }).catch(function(err) {
      throw err;
    });
  },
  registerDevice: function(token, device, models) {
    return extractSessionFromToken(token, models).then(function(session) {
      return models.apiSession.findAll({
        include: [{
          model: models.device,
          where: {
            id: device.id
          }
        }],
      }).then(function(sessions) {
        console.log(sessions);
        if (!sessions) {
          return true;
        }
        return Promise.all(sessions.map(function(session) {
          return session.destroy();
        }));
      }).then(function() {
        return session.setDevice(device);
      }).catch(function(err) {
        throw err;
      });
    }).catch(function(err) {
      throw err;
    });      
  },
  destroy: function(token, models) {
    return extractSessionFromToken(token, models).then(function(session) {
      return session.destroy();
    }).catch(function(err) {
      throw err;
    });
  },
  refresh: function(token, models) {
    return extractSessionFromToken(token, models).then(function(session) {
      return buildTokenUser(session.user);
    }).then(function(user) {
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


