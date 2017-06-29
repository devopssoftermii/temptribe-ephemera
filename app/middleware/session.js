var jwt = require('jsonwebtoken');

module.exports = {
  create: function(result, models) {
    var user = result.get({ plain: true });
    return models.apiSession.create({ user_id: result }).then(function(session) {
      return {
        success: true,
        userID: user.id,
        access: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_TTL, 10) }),
        refresh: jwt.sign(session, process.env.JWT_SECRET, { expiresIn: 86400 * 365 })
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  }
};
