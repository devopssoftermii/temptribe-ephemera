module.exports = function(router) {
  router.post('/favourites', function(req, res, next) {
    var { shiftId } = req.params;
    var { sequelize } = req.app.locals;
    return sequelize.query('dbo.udf_availableStaff :shiftId', {
      replacements: {
        shiftId
      }
    }).then(function(result) {
      return !!result[0].IsFullyStaffed;
    });
  });
}