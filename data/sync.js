require('dotenv-safe').config({
  path: '../.env',
  sample: '../.env.example'
});
var Sequelize = require('sequelize');

var sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: console.log
});

var models = ['apiSession'];

models.forEach(function(model) {
  sequelize.import(`${__dirname}/models/${model}`);
});

sequelize.sync({
  force: (process.env.NODE_ENV === 'development')
});
