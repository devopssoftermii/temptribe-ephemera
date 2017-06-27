var auto = new SequelizeAuto('LolaLocal', 'sequelize_test', 'abcdefgh123', {
    host: 'LOLA02',
    dialect: 'mssql',
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
