const jwt = require('jsonwebtoken');

module.exports = {
  generateURLHash: function(user, intent) {
    return jwt.sign({
      user,
      intent
    }, process.env.JWT_SECRET, {
      expiresIn: 86400 * 7
    });
  }
}