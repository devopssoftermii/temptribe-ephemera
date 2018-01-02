module.exports = function(router) {
  router.get('/faqs/:type', function(req, res, next) {
    var { sequelize, staticCache } = req.app.locals;
    if (!req.params.type.match(/^staff$/)) {
      throw new ClientError('missing_type', {
        message: `Unknown FAQ type ${req.params.type}`
      });
    }
    return staticCache.getOrSet({
      key: `${type}FAQs`
    }, function() {
      return models.faqs.scope([req.params.type]).findAll();
    });
  });
};
