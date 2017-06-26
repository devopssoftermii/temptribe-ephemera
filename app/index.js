var router  = require('express').Router(),
    jwt     = require('express-jwt');

router.use('/public', function(req, res, next) {
  res.send('public');
  next();
});
router.use('/private', jwt({
  secret: process.env.JWT_SECRET
}), function(req, res, next) {
  res.send('private');
  next();
});

module.exports = router;
