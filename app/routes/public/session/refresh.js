var session = require('../../../middleware/session');

module.exports = function(router) {
  router.post('/refresh', function(req, res, next) {
    if (!req.body.token) {
      res.status(401).json({
        success: false,
        error: 'Missing refresh token'
      });
      return;
    }
    return session.refresh(req.body.token, req.app.locals.models).then(function(refreshResult) {
      res.json(refreshResult);
    }).catch(function(err) {
      res.status(401).json({
        success: false,
        error: err.message
      }).end();
    });
  });
}
