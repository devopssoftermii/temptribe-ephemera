const ClientError = require('../../../../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.get('/available', function(req, res, next) {
    var { shiftId } = req.params;
    var { favourites } = req.query;
    var { sequelize } = req.app.locals;
    favourites = !!favourites;
    shiftId = parseInt(shiftId);
    if (isNaN(shiftId)) {
      throw new ClientError('missing_shift', {message: 'Invalid or missing shiftId'});
    }
    return sequelize.query('select * from dbo.udf_availableStaff(:shiftId, :favourites)', {
      replacements: {
        shiftId,
        favourites
      },
      type: sequelize.QueryTypes.SELECT
    }).then(function(result) {
      res.jsend(result.map(function(user) {
        return user.userid
      }));
    }).catch(function(err) {
      next(err);
    });
  });
}