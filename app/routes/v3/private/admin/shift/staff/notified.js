module.exports = function(router) {
  router.get('/notified', function(req, res, next) {
    var { favourites } = req.query;
    var { shiftId } = req.params;
    var field = !!favourites? 'notifiedReg': 'notifiedAll';
    shiftId = parseInt(shiftId);
    if (isNaN(shiftId)) {
      throw new ClientError('missing_shift', {message: 'Invalid or missing shiftId'});
    }
    var models = req.app.locals.models;
    models.eventShifts.findOne({
      attributes: ['id', 'notifiedReg', 'notifiedAll'],
      where: {
        id: shiftId
      },
    }).then(function(shift) {
      return shift.update({
        [field]: 1
      }, {
        fields: [field]
      });
    }).then(function(shift) {
      res.jsend(null);
    }).catch(function(err) {
      next(err);
    });
  });
}