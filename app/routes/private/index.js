var router  = require('express').Router();

router.use('/', function(req, res, next) {
  res.send('Private endpoint');
});

module.exports = router;
