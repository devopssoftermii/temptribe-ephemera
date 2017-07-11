var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var after = null;
    var page = null;
    var status = req.params.status;
    if (['confirmed', 'applied', 'cancelled', 'history'].indexOf(status) === -1) {
      status = 'confirmed';
    }
    if (req.query.after && !isNaN(parseInt(req.query.after, 10))) {
      after = req.query.after;
    } else if (req.query.page && !isNaN(parseInt(req.query.page, 10))) {
      page = req.query.page;
    }
    return models.eventShifts.scope([{
      method: ['staff', status === 'history'? 'past': 'future', 'minimal', req.user.id, status]
    }]).findAndCountAll({
      distinct: true,
      col: 'eventShifts.id'
    }).then(function(result) {
      res.json(eventHelpers.formatShiftList(result, 'minimal', after, page));
    }).catch(function(err) {
      next(err);
    });
  });
}
