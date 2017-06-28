var router    = require('express').Router(),
    path      = require('path'),
    fs        = require('fs');

router.post('/login', require(`${__dirname}/login`));

router.use('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
