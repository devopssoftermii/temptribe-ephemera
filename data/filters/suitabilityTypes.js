module.exports = function(req, models, output) {
  var typeList = req.user.suitabilityTypes.map(function(type) {
    return type.id;
  });
  var selectedSet;
  if (req.query.filters && req.query.filters.suit) {
      if (Array.isArray(req.query.filters.suit)) {
          selectedSet = new Set(req.query.filters.suit);
      } else {
          var testType = parseInt(req.query.filters.suit, 10);
          if (!isNaN(testType)) {
              selectedSet = new Set([testType]);
          }
      }
      if (selectedSet) {
          var testList = Array.from(new Set(typeList)).filter(function(item) {
              return selectedSet.has(item.toString());
          });
          if (testList.length) {
              typeList = testList;
          }
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
