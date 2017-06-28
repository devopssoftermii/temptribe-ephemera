module.exports = function(req, res, next) {
  var models = req.app.locals.models;
  models.users.findById(226890, {
    include: [{
      model: models.userTimesheets,
      as: 'timesheets',
      where: {
        status: 4
      },
      include: [{
        model: models.eventShifts,
        as: 'shift',
        include: [{
          model: models.events,
          as: 'event',
          where: {
            eventDate: {
              $gt: new Date(Date.now() - 864e5)
            }
          }
        }]
      }]
    }]
  }).then(function(result) {
    res.json(result.timesheets.map(function(timesheet) {
      return timesheet.shift;
    }));
  });
}
