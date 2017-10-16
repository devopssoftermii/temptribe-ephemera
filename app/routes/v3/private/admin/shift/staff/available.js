module.exports = function(router) {
  router.get('/available', function(req, res, next) {
    var { shiftId } = req.params;
    var { sequelize } = req.app.locals;
    return sequelize.query('dbo.udf_availableStaff :shiftId', {
      replacements: {
        shiftId
      }
    }).catch(function(err) {
      next(err);
    });
  });
}