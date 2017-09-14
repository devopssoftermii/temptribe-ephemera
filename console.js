var repl = require("repl");

require('dotenv-safe').config();

var app = {
  locals: {}
};
require('./data')(app);

// open the repl session
var replServer = repl.start({
  prompt: "ephemera > ",
});

replServer.context.db = app.locals;
