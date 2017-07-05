var filters = {};

fs.readdirSync(__dirname).forEach(function(filename) {
  var name = path.basename(filename, '.js');
  if (name !== path.basename(__filename, '.js')) {
    filters[name] = require(`${__dirname}/${name}`);
  }
});

module.exports = function(query, models) {
  var output = {
    key: {},
    scope: {
      where: {
        $and: []
      }
    }
  };
  Object.keys(filters).forEach(function(name) {
    var normalized = filters[name](query, models);
    output.key[name] = normalized.key;
    if (normalized.scope) {
      output.scope.where.$and.push(normalized.scope);
    }
  });
  return output;
}
