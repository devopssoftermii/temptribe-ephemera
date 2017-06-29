var session = require('../../../middleware/session');

module.exports = function(router) {
  router.post('/refresh', function(req, res, next) {
    if (!req.body.refresh) {
      res.status(401).json({
        success: false,
        error: 'Missing refresh token'
      });
      return;
    }
    return session.refresh(req.body.refresh, req.app.locals.models).then(function(refreshResult) {
      res.json(refreshResult);
    }).catch(function(err) {
      res.status(401).json({
        success: false,
        error: err.message
      }).end();
    });
  });
}
