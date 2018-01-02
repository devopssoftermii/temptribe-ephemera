module.exports = function(router) {
  router.get('/faqs/:type', function(req, res, next) {
    var { models, staticCache } = req.app.locals;
    if (!req.params.type.match(/^staff$/)) {
      throw new ClientError('missing_type', {
        message: `Unknown FAQ type ${req.params.type}`
      });
    }
    var key = JSON.stringify({
      key: `${req.params.type}FAQs`
    });
    return staticCache.getOrSet(key, function() {
      return models.faqs.scope([req.params.type]).findAll();
    }).then(function(result) {
      res.jsend(result);
    });
  });
};
