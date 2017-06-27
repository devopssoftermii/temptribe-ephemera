var router    = require('express').Router(),
    auth      = require('../../middleware/auth'),
    path      = require('path'),
    fs        = require('fs');

router.use(auth);

fs.readdirSync(__dirname).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  if (route !== path.basename(__filename, '.js')) {
    router.use('/' + route, require(`${__dirname}/${route}`));
  }
});

router.use('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
