var jwt = require('express-jwt');

module.exports = function(req, res, next) {
  jwt({ secret: process.env.JWT_SECRET })(req, res, next);
};
