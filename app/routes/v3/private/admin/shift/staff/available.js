const ClientError = require('../../../../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.get('/available', function(req, res, next) {
    var { shiftId } = req.params;
    var { sequelize } = req.app.locals;
    shiftId = parseInt(shiftId);
    if (isNaN(shiftId)) {
      throw new ClientError('missing_shift', {message: 'Invalid or missing shiftId'});
    }
    return sequelize.query('select * from dbo.udf_availableStaff(:shiftId)', {
      replacements: {
        shiftId
      }
    }).then(function(result) {
      res.send(result);
    }).catch(function(err) {
      next(err);
    });
  });
}