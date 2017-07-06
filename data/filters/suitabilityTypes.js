module.exports = function(req, models, output) {
  output.key.suitabilityTypes = req.user.id;
  if (!output.scope.include) {
    output.scope.include = [];
  }
  output.scope.include.push({
    model: models.suitabilityTypes,
    required: true,
    where: {
      ID: {
        $in: req.user.suitabilityTypes.map(function(type) {
          return type.id;
        })
      }
    }
  });

}
