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

//replServer.context.users = [254514, 255531, 255556, 254764, 250837, 250498, 247667, 261742, 261376, 261243, 261112, 260825, 268537, 268366, 268237, 266780, 266546, 263648, 262180, 271742, 261932, 238679, 238461, 236743, 249751, 248087, 233156, 229526, 229862, 229013, 225234, 220203, 214011, 210903, 205348, 197655, 178755, 149709, 139803, 175211, 130858, 113424, 257182, 18905, 253838, 253901, 254003, 254356, 256754, 257001, 255505, 260920, 255245, 259714, 260789, 261557, 261717, 262004, 262033, 262758, 12706, 72820, 102886, 122281, 154420, 169147, 169662, 173047, 173095, 174796, 175184, 159998, 181316, 192764, 192858, 176045, 197579, 201059, 206869, 211047, 213312, 214068, 214869, 215342, 215799, 215944, 217395, 220610, 221035, 221101, 222982, 222421, 225981, 209713, 210340, 226942, 227367, 228492, 227514, 230222]

replServer.context.users = [261112];


replServer.context.example = {
	"deviceIds": ["eGfOfYGJy98:APA91bHv77g5iVp4EAjJuFKhpNh6oVDs0c5HZ7fKcAM3rJ1JZEUl04jRjsA-M4-83N3LnaVZppNSWamSmr2yfEFwRRaDEghXkFX539L8Qx5TVkqKCzUeZdLCmfniHFy5QuWEz5HaF5xH"],
	"title": "We have a shift for you! 💼",
	"body": "The shift on Tue 24th July 2018 at 11:15am for Humdinger Catering at 100 Great Portland Street  is live! Please apply if you would like to work.",
	"icon": "ic_new_shift",
	"data": {
		"routeName": "EventDetails",
		"params": {
			"shiftId": 229099
		}
	}
};

// xy.sendWithoutSaving(db.models, db.sequelize, users, example.title, example.body, example.data, example.icon).then(function(x) {
// 	console.log(x);
// })

replServer.context.xy = {
  sendWithoutSaving: function(models, sequelize, to, title, body, data, icon) {
    var actualSend = process.env.NOTIFICATIONS_DISABLE !== 'true';
    return models.notification.create({
      title,
      body,
      data,
      icon
    }).then(function(notification) {
      return sequelize.query(
        'select u.id, api.deviceId from users u join apiSession api on api.userId = u.id where u.id IN (:userIds) AND api.deviceId IS NOT NULL',
        { replacements: { userIds: to }, type: sequelize.QueryTypes.SELECT }
      ).then(results => {
        //results = [{id: 124, deviceId: 'wadawdwadawda'}, {id: 124, deviceId: 'wadawdwadawda'}] an array of objects with userId and deciveId
        if (actualSend) {
          return fetch(process.env.MAILER_ENDPOINT + '/sendbatchnotification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
            },
            body: JSON.stringify({
              id: notification.id,
              deviceIds: results.map(function(i) {return i.deviceId;}),
              title,
              body,
              data,
              icon
            })
          }).then(function(response) {
          	return response
          });
        } else {
          return null;
        }
      }).then(function(to) {
      	console.log(to)
        return {
          sent: actualSend,
          to
        };
      });
    });
  }
};


// db.sequelize.query('select u.id, api.deviceId from users u join apiSession api on api.userId = u.id where u.id IN (:userIds) AND api.deviceId IS NOT NULL',
//   { replacements: { userIds: users }, type: db.sequelize.QueryTypes.SELECT }
// ).then(results => {
//   console.log(results)
//   // [{id: 124, deviceId: 'wadawdwadawda'}]
// })


//

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
