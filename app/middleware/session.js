var jwt = require('jsonwebtoken');

module.exports = {
  create: function(user) {
    return {
      success: true,
      userID: user.id,
      token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL })
    }
  }
};
