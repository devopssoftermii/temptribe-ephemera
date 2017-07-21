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
      })).then(function() {
        return shift;
      });
    }).then(function(shift) {
      var start = moment(shift.originalStartTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
      var finish = moment(shift.originalFinishTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
      return models.eventShifts.findAll({
        include: [{
          model: models.events,
          as: 'event',
          where: {
            eventDate: moment(shift.event.eventDate).format('YYYY-MM-DD')
          }
        }, {
          model: models.userTimesheets.scope([{
            method: ['byUser', req.user.id]
          }, 'confirmed']),
          as: 'timesheets'
        }],
        where: {
          $or: [{
            $and: [{
              originalStartTime: { $gte: start },
              originalStartTime: { $lte: finish },
            }]
          }, {
            $and: [{
              originalFinishTime: { $gte: start },
              originalFinishTime: { $lte: finish },
            }]
          }, {
            $and: [{
              originalStartTime: { $lte: start },
              originalFinishTime: { $gte: finish },
            }]
          }]
        }
      }).then(function(clashing) {
        if (clashing) {
          throw new ClientError('already_booked_other', { message: 'You are already booked on another shift at this time' });
        }
        return shift;
      }).catch(function(err) {
        throw err;
      });
    }).catch(function(err) {
      next(err);
    });
  });
}
