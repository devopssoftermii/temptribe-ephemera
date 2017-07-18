module.exports = function(req, models, output) {
  if (!req.body.f || !req.body.f.fav) {
    return;
  }
  output.key.favourites = true;
  if (!output.scope.where) {
    output.scope.where = {
      $and: []
    };
  }
  output.scope.where.$and.push({
    originalStartTime: {
      $gte: moment('1900-01-01 00:00:00.000').add(startTime - 0.5, 'hours')
    }
  }, {
    originalFinishTime: {
      $lte: moment('1900-01-01 00:00:00.000').add(endTime + 0.5, 'hours')
    }
  });
}
