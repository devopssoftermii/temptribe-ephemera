var router  = require('express').Router(),
    auth    = require('./middleware/auth'),
    private = require('./routes/private'),
    public  = require('./routes/public');

router.use('/public', public);
router.use('/private', auth, private);

module.exports = router;
