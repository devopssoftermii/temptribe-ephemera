var eventHelpers = require('../../../../lib/events');

module.exports = function(router) {
  router.get('/shifts/:status(\\w+)', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var models = req.app.locals.models;
    var page = 1;
    var after = null;
    var status = req.params.status;
    if (['confirmed', 'applied', 'cancelled', 'history'].indexOf(status) === -1) {
      status = 'confirmed';
    }
    if (req.query.page && !isNaN(parseInt(req.query.page, 10))) {
      page = req.query.page;
    } else if (req.query.after && !isNaN(parseInt(req.query.after, 10))) {
      after = req.query.after;
      page = null;
    }
    return models.eventShifts.scope([{
      method: ['staff', 'full', status === 'history'? 'past': 'future', req.user.id, status]
    }]).findAndCountAll({
      distinct: true,
      col: 'eventShifts.id'
    }).then(function(result) {
      var pageInfo = {
        page,
        limit: parseInt(process.env.SHIFTLIST_PAGE_SIZE, 10),
        after
      }
      res.json(eventHelpers.formatShiftList(result, 'full', pageInfo));
    }).catch(function(err) {
      next(err);
    });
  });
}
