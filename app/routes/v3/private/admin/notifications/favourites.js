const ClientError = require('../../../../../../lib/errors/ClientError');
const notifications = require('../../../../../../lib/notifications');

function validateInt(...args) {
  return args.every(function(arg) {
    return !isNaN(parseInt(arg));
  });
}

module.exports = function(router) {
  router.post('/favourites', function(req, res, next) {
    var { shiftId } = req.body;
    if (!validateInt(shiftId)) {
      throw new ClientError('invalid_shift', {message: 'Missing shift ID ({ shiftId })'});
    }
    var models = req.app.locals.models;
    models.eventShifts.findById(shiftId, {
      attributes: [],
      include: [{
        attributes: [],
        model: models.events,
        as: 'event',
        include: [{
          attributes: [],
          model: models.clients,
          as: 'client',
          include: [{
            attributes: ['id'],
            model: models.users,
            as: 'favourited',
          }]
        }]
      }, {
        attributes: [],
        model: models.userTimesheets,
        as: 'timesheets',
        include: [{
          attributes: ['id'],
          model: model.users,
          as: 'user',
        }]
      }]
    }).then(function(shift) {
      res.jsend({
        favourites: shift.event.client.favourited.map((user) => user.id),
        applied: shift.timesheets.user.map((user) => user.id)
      });
    }).catch(function(err) {
      next(err);
    });




    // return notifications.send(req.app.locals.models, to, title, body).then(function(result) {
    //   res.jsend(formatResponse(result, format));
    // }).catch(function(err) {
    //   next(err);
    // });
  });
}