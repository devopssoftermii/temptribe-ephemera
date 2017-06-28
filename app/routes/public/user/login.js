var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    if (!req.body.email || req.body.password) {
      throw new Error('Missing email or password');
    }
    var models = req.app.locals.models;
    var sequelize = req.app.locals.sequelize;
    models.users.find({
      attributes: [
        'id',
        'email'
      ],
      where: {
        $and: {
          email: req.body.email,
          password: sequelize.fn('udf_CalculateHash', req.body.password, sequelize.col('salt'))
        }
      }
    }).then(function(result) {
      if (!result) {
        throw new Error('Unknown user or password');
      }
      res.json({
        success: true,
        userID: result.id
        token: jwt.sign(result, process.env.JWT_SECRET, { expiresIn: 60*60*1000000 })
      });
    }).catch(function(err) {
      throw new Error('Unknown user or password');
    });
  } catch (ex) {
    res.status(401).json({
      success: false,
      error: ex.message
    });
  }
}
