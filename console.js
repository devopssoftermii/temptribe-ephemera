var repl = require("repl");

require('dotenv-safe').config();

var app = {locals: 'foo'};

require('./data')(app);


  // open the repl session
  var replServer = repl.start({
    prompt: "repl> ",
  });

replServer.context.db = app.locals

//db.models.trainingSessions.findById(3608).then(x => x.full()).then(x => {console.log(x)})
