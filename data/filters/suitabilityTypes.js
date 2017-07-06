module.exports = function(req, models, output) {
  var typeList = req.user.suitabilityTypes.map(function(type) {
    return type.id;
  }).sort();
  output.key.suitabilityTypes = typeList;
  if (!output.scope.include) {
    output.scope.include = [];
  }
  output.scope.include.push({
    model: models.suitabilityTypes,
    required: true,
  });

}
