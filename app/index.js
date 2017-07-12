var router    = require('express').Router(),
    path      = require('path'),
    fs        = require('fs');

fs.readdirSync(`${__dirname}/routes`).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  require(`${__dirname}/routes/${route}`)(router);
});

router.use('/', function(req, res, next) {
  res.status(404).end();
});

router.use(function(err, req, res, next) {
  if (process.env.NODE_ENV !== 'development') {
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
    next(err);
  } else if (err instanceof Error) {
    res.status(500).json({
      name: err.name,
      message: err.message,
      stack: err.stack? err.stack: ''
    });
  }
});



module.exports = router;
