module.exports = function(router) {
  router.get('/booked', function(req, res, next) {
    var { shiftId } = req.params;
    shiftId = parseInt(shiftId);
    if (isNaN(shiftId)) {
      throw new ClientError('missing_shift', {message: 'Invalid or missing shiftId'});
    }
    var models = req.app.locals.models;
    models.eventShifts.findOne({
      where: {
        id: shiftId
      },
      include: [{
        model: models.userTimesheets.scope('onlyBooked'),
        as: 'timesheets',
        include: [{
          attributes: ['id'],
          model: models.users,
          as: 'user',
          required: true
        }],
        required: false
      }]
    }).then(function(shift) {
      res.jsend(shift.timesheets.map((timesheet) => timesheet.user.id));
    }).catch(function(err) {
      next(err);
    });
  });
}