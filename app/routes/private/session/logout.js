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
    try {
      return session.destroy(req.body.token, req.app.locals.models).then(function(logoutResult) {
        res.json(logoutResult);
      });
    } catch (ex) {
      res.status(500).json({
        success: false,
        error: ex.message
      });
    }
  });
}
