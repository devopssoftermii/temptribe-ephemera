// THIS FILE IS USED TO TEST INSIDE A REPL. IT IS USEFUL TO TRY OUT DATABASE CALLS USING SEQULIZE

var repl = require("repl");

require('dotenv-safe').config();

require("isomorphic-fetch");

var app = {
  locals: {}
};
require('./data')(app);

// open the repl session
var replServer = repl.start({
  prompt: "ephemera > ",
});

replServer.context.db = app.locals;

// test db queries here:
// run this file in node and it will give you a prompt with access to the db

// example - compy this into the prompts 
// db.sequelize.query('select TOP 1 * from users where id=:userId',
//   { replacements: { userId: 1 }, type: db.sequelize.QueryTypes.SELECT }
// ).then(results => {
//   console.log(results)
// });