var jwt = require('express-jwt');

module.exports = function(req, res, next) {
  if (process.env.SKIP_LOGIN === 'true') {
    next();
  } else {
    jwt({ secret: process.env.JWT_SECRET })(req, res, next);
  }
};
