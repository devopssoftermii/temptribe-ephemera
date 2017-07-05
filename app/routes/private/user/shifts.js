var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    models.users.scope('shifts').findById(req.user.id).then(function(result) {
      if (result) {
        res.json(result.timesheets.map(function(timesheet) {
          return timesheet.shift;
        }).sort(eventHelpers.sortByShift));
      } else {
        res.json([]);
      }
    }).catch(function(err) {
      res.status(500).json(process.env.NODE_ENV === 'development'? err: null);
    });
  });
}
