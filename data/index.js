var Sequelize = require('sequelize'),
    fs = require('fs');

var sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

var models = {};

fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  var model = sequelize.import(`${__dirname}/models/${filename}`);
  models[model.name] = model;
});

Object.keys(models).forEach(function(modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  models
}
