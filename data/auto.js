require('dotenv-safe').config({
  path: '../.env',
  sample: '../.env.example'
});
var SequelizeAuto = require('sequelize-auto');

var auto = new SequelizeAuto(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    directory: `${__dirname}/models`, // prevents the program from writing to disk
    additional: {
        timestamps: false,
        freezeTableName: true
    },
    tables: [
      'clients',
      'events',
      'eventShifts',
      'users',
      'venues'
    ]
});

auto.run(function (err) {
  if (err) throw err;

  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
