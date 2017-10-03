const jwt = require('jsonwebtoken');

module.exports = {
  generateURLHash: function(user, intent) {
    return jwt.sign({
      user: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email
      },
      intent
    }, process.env.JWT_SECRET, {
      expiresIn: 86400 * 60
    });
  },
  getDevices: function(user, models) {
    return user.getApiSessions({
      include: [{
        model: models.device,
        required: true
      }]
    }).then(function(sessions) {
      return sessions.map(function(session) {
        return session.device;
      });
    });
  }
}