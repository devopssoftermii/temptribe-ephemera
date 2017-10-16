module.exports = function(router) {
  router.get('/booked', function(req, res, next) {
    var { shiftId } = req.params;
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
      }]
    }).then(function(shift) {
      res.jsend(shift.timesheets.map((timesheet) => timesheet.user.id));
    }).catch(function(err) {
      next(err);
    });
  });
}