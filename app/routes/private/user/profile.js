module.exports = function(router) {
  router.use('/profile', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    models.users.findById(req.user.id, {
      attributes: [
        'id',
        'firstname',
        'surname',
        'email',
        'mobile',
      ],
      include: [{
        model: models.userPhotos,
        attributes: [['FileName', 'filename']],
        as: 'photos',
        where: {
          IsMainImage: 1
        }
      }]
    }).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      res.status(500).json(null);
    });
  });
}
