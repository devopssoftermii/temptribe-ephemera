const HISTORY_STATUSES = new Map([
  ['incomplete', 0],
  ['unconfirmed', 1],
  ['complete', 2],
]);

module.exports = function(router) {
  router.get('/history', function(req, res, next) {
    var sequelize = req.app.locals.sequelize;
    var { status, page, size } = req.query;
    if (!status || !HISTORY_STATUSES.has(status)) {
      status = 'complete';
    }
    if ('undefined' === typeof(page)) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    return sequelize.query(`select
      rownum as num, paid, timesheetStatus,
      staffStartTime, staffEndTime, staffBreaks, staffWorked,
      clientStartTime, clientEndTime, clientBreaks, clientWorked,
      originalStartTime, originalEndTime, originalBreaks,
      hourlyRate, date, eventTitle, eventSubtitle, venueName
    from dbo.udf_userWorkHistory(:userId, :status, :page, :size)`, {
      replacements: {
        userId: req.user.id,
        status: HISTORY_STATUSES.get(status),
        page,
        size
      }
    }).then(function(result) {
      res.jsend(result[0]);
    }).catch(function(err) {
      next(err);
    });
  });
}
