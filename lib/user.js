const jwt = require('jsonwebtoken');

module.exports = {
  generateURLHash: function(user, intent) {
    return jwt.sign({
      user: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
      },
      intent
    }, process.env.JWT_SECRET, {
      expiresIn: 86400 * 7
    });
  }
}