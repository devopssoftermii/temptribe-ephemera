var router    = require('express').Router({ mergeParams: true }),
path      = require('path'),
fs        = require('fs');

fs.readdirSync(__dirname).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  if (route !== path.basename(__filename, '.js')) {
    require(`${__dirname}/${route}`)(router);
  }
});

module.exports = function(upRouter) {
  upRouter.use('/' + path.basename(__dirname), router);
};
