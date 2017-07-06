var session = require('../../../middleware/session');

module.exports = function(router) {
  router.post('/logout', function(req, res, next) {
    if (!req.body.token) {
      res.status(401).json({
        success: false,
        error: 'Missing refresh token'
      });
      return;
    }
    return session.destroy(req.body.token, req.app.locals.models).then(function(logoutResult) {
      return req.app.locals.sessionBlacklist.pset(req.headers.authorization.split(' ')[1], true);
    }).then(function(token) {
      res.json({
        success: true
      });
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: {
        success: false,
        error: 'Internal server error'
      });
    });
  });
}
