var router    = require('express').Router(),
    path      = require('path'),
    fs        = require('fs');

router.use(require('../../middleware/auth'));
router.use(function(req, res, next) {
  if (!req.user || !req.user.id) {
    res.status(500).json({
      error: true,
      message: 'Authenticated but no user set - something has gone wrong'
    });
  } else {
    next();
  }
});

fs.readdirSync(__dirname).forEach(function(filename) {
  var route = path.basename(filename, '.js');
  if (route !== path.basename(__filename, '.js')) {
    require(`${__dirname}/${route}`)(router);
  }
});

module.exports = function(upRouter) {
  upRouter.use('/' + path.basename(__dirname), router);
};
