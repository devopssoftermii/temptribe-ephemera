// Import config into process.env
require('dotenv-safe').config();
var jwt = require('jsonwebtoken');

jwt.sign({
  id: -1,
  userTypeID: 2,
  firstname: '',
  surname: '',
}, process.env.JWT_SECRET, { expiresIn: 31557600 })