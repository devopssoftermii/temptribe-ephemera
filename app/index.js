var router    = require('express').Router(),
    path      = require('path'),
    fs        = require('fs');

fs.readdirSync(`${__dirname}/routes`).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  router.use('/' + route, require(`${__dirname}/routes/${route}`));
});

router.use('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
