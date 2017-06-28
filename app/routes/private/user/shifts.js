module.exports = function(req, res, next) {
  var models = req.app.locals.models;
  models.users.findById(226890, {
    include: [{
      model: models.userTimesheets,
      as: 'timesheets',
      include: [{
        model: models.eventShifts,
        as: 'shifts',
      }]
    }]
  }).then(function(result) {
    res.json(result);
  });
}
