const HISTORY_STATUSES = new Map([
  ['incomplete', 0],
  ['unconfirmed', 1],
  ['complete', 2],
]);

module.exports = function(router) {
  router.get('/history', function(req, res, next) {
    var { sequelize } = req.app.locals;
    var { status } = req.query;
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    if (!status || !HISTORY_STATUSES.has(status)) {
      status = 'complete';
    }
    if ('undefined' === typeof(page) || isNaN(page)) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    return sequelize.query(`select rownum as num, paid, timesheetStatus,
      staffStartTime, staffEndTime, staffBreaks, staffWorked,
      originalStartTime, originalEndTime, originalBreaks,
      hourlyRate, [date], eventTitle, eventSubtitle, jobRole, venueID,
      venueName from dbo.udf_userWorkHistory(:userId, :status, :page, :size)`,
    {
      replacements: {
        userId: req.user.id,
        status: HISTORY_STATUSES.get(status),
        page,
        size
      },
      type: sequelize.QueryTypes.SELECT
    }).then(function(result) {
      res.jsend(result);
    }).catch(function(err) {
      next(err);
    });
  });
}
