const Sequelize = require('sequelize');

const connection = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

module.exports = connection;
