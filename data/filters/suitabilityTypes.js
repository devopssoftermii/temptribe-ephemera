module.exports = function(req, models, output) {
  var typeList = req.user.suitabilityTypes.map(function(type) {
    return type.id;
  });
  if (req.query.filters && req.query.filters.suit) {
      var filterSuit = req.query.filters.suit;
      if (!Array.isArray(filterSuit)) {
          filterSuit = [filterSuit];
      }
      var selectedSet = new Set(filterSuit);
      var testList = Array.from(new Set(typeList)).filter(function(item) {
          return selectedSet.has(item.toString());
      });
      if (testList.length) {
          typeList = testList;
      }
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