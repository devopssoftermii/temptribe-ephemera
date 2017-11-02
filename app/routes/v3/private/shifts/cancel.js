var moment = require('moment');
var ClientError = require('../../../../../lib/errors/ClientError');
var {
  getClashingShifts,
  isFullyStaffed,
  bookUserOnShift
} = require('../../../../../lib/events');

module.exports = function(router) {
  router.post('/cancel/:id', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var id = req.params.id;
    var cache = req.app.locals.shiftlistCache;
    var foundTimesheet = null;
    models.eventShifts.scope({
      method: ['staff', 'standard', req.user.blacklistedBy, 'future']
    }).findById(id).then(function(shift) {
      if (!shift) {
        throw new ClientError('invalid_shift', { message: 'No such shift' });
      }
      return shift.getTimesheets().then(function(timesheets) {
        return Promise.all(timesheets.map(function(timesheet) {
          return timesheet.getUser().then(function(user) {
            if ((timesheet.status === 4 || timesheet.status === 1) && user.id === req.user.id) {
              foundTimesheet = timesheet;
            }
          });
        }))
      });
    }).then(function() {
      if (foundTimesheet === null) {
        return null;
      }
      return foundTimesheet.update({
        status: 7
      }, {
        fields: ['status']
      });
    }).then(function() {
      res.jsend({
        result: 'cancelled'
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
