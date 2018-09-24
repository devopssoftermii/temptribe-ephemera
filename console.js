// THIS FILE IS USED TO TEST INSIDE A REPL. IT IS USEFUL TO TRY OUT DATABASE CALLS USING SEQULIZE

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

 // models.eventShifts.findAll({
 //    attributes: ['id', timeField],
 //    include: [{
 //      attributes: ['eventDate'],
 //      model: models.events,
 //      as: 'event',
 //      where: {
 //        eventDate: {
 //          $gte: dateStart,
 //          $lt: dateEnd,
 //        },
 //        status: {
 //          $not: 5
 //        }
 //      },
 //      include: [{
 //        model: models.venues,
 //        as: 'venue',
 //        attributes: ['name'],
 //        required: true
 //      }, {
 //        model: models.clients,
 //        as: 'client',
 //        attributes: ['clientName'],
 //        required: true
 //      }],
 //    }],
 //    where: {
 //      [timeField]: {
 //        $gte: timeStart,
 //        $lt: timeEnd,
 //      },
 //      status: {
 //        $notIn: [0, 2, 7]
 //      }
 //    }
 //  }).then(function(results) { console.log(results)}
