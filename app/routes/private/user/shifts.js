var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var after = null;
    var limit = parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10);
    var status = req.params.status;
    if (['confirmed', 'applied', 'cancelled', 'history'].indexOf(status) === -1) {
      status = 'confirmed';
    }
    if (req.query.after && !isNaN(parseInt(req.body.after, 10))) {
      after = req.body.after;
    }
    return models.eventShifts.scope([{
      method: ['staff', status === 'history'? 'past': 'future', 'minimal', req.user.id, status]
    }]).findAndCountAll({
      distinct: true,
      col: 'eventShifts.id'
    }).then(function(result) {
      res.json(eventHelpers.formatShiftList(result, after));
    }).catch(function(err) {
      next(err);
    });
  });
}
