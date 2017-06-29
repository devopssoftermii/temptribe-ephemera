var jwt = require('jsonwebtoken');

module.exports = {
  create: function(user, models) {
    return models.apiSession.create({ userId: user.id }).then(function(session) {
      return {
        success: true,
        userId: user.id,
        access: jwt.sign(user.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
        refresh: jwt.sign(session.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: '1y' })
      }
    });
  },
  refresh: function(token, models) {
    return new Promise(function(resolve, reject) {
      try {
        resolve(jwt.verify(token, process.env.JWT_SECRET));
      } catch (ex) {
        reject(new Error('Invalid refresh token'));
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
      }).then(function(result) {
        if (!result) {
          throw new Error('Invalid session');
        }
        return {
          success: true,
          userId: user.id,
          access: jwt.sign(result.user.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
          refresh: jwt.sign(result.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: 86400 * 365 })
        };
      });
    });
  }
};
