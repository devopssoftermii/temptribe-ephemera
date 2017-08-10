var router    = require('express').Router(),
    path      = require('path'),
    fs        = require('fs');

require('../../../../middleware/queryauth')(router);

fs.readdirSync(__dirname).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  if (route !== path.basename(__filename, '.js')) {
    require(`${__dirname}/${route}`)(router);
  }
});

module.exports = function(upRouter) {
  upRouter.use('/' + path.basename(__dirname), router);
};
