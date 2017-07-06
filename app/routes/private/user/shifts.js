var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    if (['confirmed', 'applied', 'cancelled'].indexOf(req.params.status) === -1) {
      req.params.status = 'confirmed';
    }
    models.users.scope({ method: ['shifts', req.params.status] }).findById(req.user.id).then(function(result) {
      if (result) {
        var shifts = result.timesheets.map(function(timesheet) {
          return timesheet.shift;
        }).sort(eventHelpers.sortByShift);
      } else {
        shifts = [];
      }
      res.json({
        total: shifts.length,
        shifts
      });
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: {
        error: true,
        message: 'Failed to fetch shifts'
      });
    });
  });
}
