var jwt = require('express-jwt');

module.exports = function(req, res, next) {
  if (process.env.SKIP_LOGIN === 'true') {
    next();
  } else {
    try {
      jwt({ secret: process.env.JWT_SECRET })(req, res, next);
    } catch (ex) {
      res.status(401).json({
        authorised: false,
        message: ex.message
      });
    }
  }
};
