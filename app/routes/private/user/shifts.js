module.exports = function(req, res, next) {
  req.app.locals.models.events.findById(143544, {
    include: [{
      model: req.app.locals.models.eventShifts
    }]
  }).then(function(result) {
    res.json(result.eventShifts);
  });
}
