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
    scope: {
      include: {}
    }
  };
  if ('object' === typeof(req.query.f)) {
    ignoreQueryFilters.forEach(function(filter) {
      if (req.body.f[filter]) {
        delete req.body.f[filter];
      }
    });
  }
  Object.keys(filters).forEach(function(name) {
    filters[name](req, models, output);
  });
  return output;
}
