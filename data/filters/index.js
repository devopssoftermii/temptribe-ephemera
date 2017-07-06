const fs    = require('fs'),
      path  = require('path');

const ignoreQueryFilters = [];

var filters = {};

fs.readdirSync(__dirname).forEach(function(filename) {
  var name = path.basename(filename, '.js');
  if (name !== path.basename(__filename, '.js')) {
    filters[name] = require(`${__dirname}/${name}`);
  }
});

module.exports = function(req, models) {
  var output = {
    key: {},
    scope: {}
  };
  if ('object' === typeof(req.query.filters)) {
    ignoreQueryFilters.forEach(function(filter) {
      if (req.query.filters[filter]) {
        delete req.query.filters[filter];
      }
    });
  }
  Object.keys(filters).forEach(function(name) {
    filters[name](req, models, output);
  });
  return output;
}
