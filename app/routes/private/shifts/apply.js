var ClientError = require('../../../../lib/errors/ClientError');

module.exports = function(router) {
  router.post('/apply/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    models.eventShifts.scope({
      method: ['staff', 'standard', 'future']
    }).findById(id).then(function(shift) {
      return Promise.all([shift, shift.getTimesheets()]);
    }).then(function([shift, timesheets]) {
      return Promise.all(timesheets.map(function(timesheet) {
        return timesheet.getUser().then(function(user) {
          if (timesheet.status = 4 && user.id === req.user.id) {
            throw new ClientError('already_booked', { message: 'You are already booked on this shift' });
          }
        }).catch(function(err) {
          throw err;
        });
      }));
    }).then(function() {
      res.json({
        message: 'not booked'
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
