module.exports = function(req, models, output) {
  var typeList = req.user.suitabilityTypes.map(function(type) {
    return type.id;
  });
  if (req.query.filters && Array.isArray(req.query.filters.suit)) {
    var selectedSet = new Set(req.query.filters.suit);
    typeList = Array.from(new Set(typeList)).filter(function(item) {
      return selectedSet.has(item.toString());
    });
  }
  output.key.suitabilityTypes = typeList.sort();
  if (!output.scope.include) {
    output.scope.include = [];
  }
  output.scope.include.push({
    model: models.suitabilityTypes,
    attributes: [],
    where: {
      ID: {
        $in: typeList
      }
    },
    required: true
  });

}
