module.exports = function(router) {
  router.get('/staffTimesheet/:id', function(req, res, next) {
    var { sequelize } = req.app.locals;
    var shiftId = req.params.id;
    var cache = req.app.locals.timesheetCache;
    var key = JSON.stringify({
      shiftId,
      user: req.user.id
    });
    return cache.getOrSet(key, function(result) {
      return sequelize.query(`select paid, timesheetStatus,
        staffStartTime, staffEndTime, staffBreaks, staffWorked, shiftID,
        originalStartTime, originalEndTime, originalBreaks,
        hourlyRate, [date], eventID, eventTitle, eventSubtitle, jobRole, venueID, venueName,
        venueImage from dbo.udf_userWorkHistory(:userId, 0, 50, null, null) where shiftID = :shiftId`,
      {
        replacements: {
          userId: req.user.id,
          shiftId
        },
        type: sequelize.QueryTypes.SELECT
      })
    }).then(function(result) {
      if (result.length) {
        res.jsend(result[0]);
      } else {
        res.jsend(null);
      }
    }).catch(function(err) {
      next(err);
    });
  });
}
