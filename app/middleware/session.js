var jwt = require('jsonwebtoken');

module.exports = {
  create: function(result, models) {
    return models.apiSession.create({ userId: result }).then(function(session) {
      return {
        success: true,
        userId: user.id,
        access: jwt.sign(result.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
        refresh: jwt.sign(session.get({ plain: true }), process.env.JWT_SECRET, { expiresIn: 86400 * 365 })
      }
    }).catch(function(err) {
      throw err;
    });
  }
};
