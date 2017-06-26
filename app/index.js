var router  = require('express').Router(),
    auth    = require('./middleware/auth'),
    private = require('./endpoints/private'),
    public  = require('./endpoints/public');

router.use('/public', public);
router.use('/private', auth, private);

module.exports = router;
