module.exports = function(req, res, next) {
  req.app.locals.models.events.findById(143544).then(function(result) {
    res.json(result);
  });
}
