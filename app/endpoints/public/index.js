var router  = require('express').Router();

router.use('/', function(req, res, next) {
  res.send('Public endpoint');
});

module.exports = router;
