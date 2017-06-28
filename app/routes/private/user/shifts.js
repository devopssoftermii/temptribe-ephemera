module.exports = function(req, res, next) {
  var sequelize = req.app.locals.sequelize;
  var models = req.app.locals.models;
  models.users.findById(226890, {
    include: [{
      model: models.userTimesheets,
      as: 'timesheets',
      where: {
        $and: {
          status: 4,
          '$shift.event.eventDate$': {
            $gt: sequelize.fn('convert', sequelize.literal('DATE'), sequelize.fn('getdate'))
          }
        }
      },
      include: [{
        model: models.eventShifts,
        as: 'shift',
        include: [{
          model: models.events,
          as: 'event',
        }]
      }]
    }]
  }).then(function(result) {
    res.json(result.timesheets.map(function(timesheet) {
      return timesheet.shift;
    }));
  });
}
