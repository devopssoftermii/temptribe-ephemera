var jwt = require('jsonwebtoken');
const UnauthorizedError = require('../../lib/errors/UnauthorizedError');
const ServerError = require('../../lib/errors/ServerError');

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
  destroy: function(token, models) {
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
    }).then(function(result) {
      if (!result) {
        throw new UnauthorizedError('invalid_session', {message: 'Invalid session'});
      }
      return Promise.all([result.user, result.destroy()]);
    }).then(function(results) {
      return results[0];
    }).catch(function(err) {
      throw err;
    });
  },
  refresh: function(token, models) {
    return module.exports.destroy(token, models).then(function(user) {
      return module.exports.create(user, models);
    }).catch(function(err) {
      throw err;
    });
  }
};
