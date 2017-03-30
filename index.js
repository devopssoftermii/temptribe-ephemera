var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    bodyParser      = require('body-parser'),
    jwt             = require('express-jwt'),
    mssql           = require('mssql'),
    _               = require('underscore'),
    jwt_generator   = require('jsonwebtoken'),
    sql             = require('mssql');

var app = express();

dotenv.load();

var config = {
    user: 'mb_admin',
    password: 'smiths1001',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Lola'
}

var secret = '29dj9h2ieIJjoAWDJA'

var jwtCheck = jwt({
  secret: secret
});

function createToken(user) {
  return jwt_generator.sign(_.omit(user, 'password'), secret, { expiresIn: 60*60*100 });
}

app.use(bodyParser.json());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

app.post('/api/v1/login', function(req, res) {
  var email = null
  var password = null
  var user = null
  console.log(req.body)
  if(req.body.email && req.body.password) {
    email = req.body.email;
    password = req.body.password;
  }
  console.log('email')
  console.log(!email)

  console.log('password')
  console.log(!password)

  if (!email || !password) {
    return res.type('json').status(400).send(JSON.stringify({
      error: "Give us a username and password!"
    }));
  }

  user = {
    email: email,
    password: password,
    id: 1
  }

  if (!user) {
    return res.type('json').status(401).send(JSON.stringify({
      error: "password or username is just wrong!"
    }));
  }

  res.type('json').status(201).send(
    JSON.stringify({
      id_token: createToken(user),
      error: null
    })
  )
});

app.use('/api/v1/', jwtCheck);

app.get('/api/v1/user/:id/events', function(req, res) {

  sql.connect(config)
  .then(function() {
    var request = new sql.Request();
    request.input('userID', 1);
    request.query(
        `SELECT
        users.id,
        eventShifts.originalStartTime,
        eventShifts.originalFinishTime,
        eventShifts.startTime,
        eventShifts.finishTime,
        eventShifts.hourlyRate,
        events.title,
        events.subtitle,
        venues.*
        FROM users
        JOIN userTimesheets on userTimesheets.userID = users.id
        JOIN eventShifts on eventShifts.id = userTimesheets.eventShiftID
        JOIN events on events.id = eventShifts.eventID
        JOIN venues on events.venueID = venues.id
        WHERE users.id = 244743
        AND events.eventDate > GETDATE()`
    )
    .then(function(recordset) {
      console.log('Recordset: ' + recordset.returnValue);
      console.log('Affected: ' + request.rowsAffected);
    })
    .catch(function(err) {
      console.log('Request error: ' + err);
    });
  })
  .catch(function(err) {
      console.log('there was an err', err)
  });
});


// SELECT 
// users.id,
// CONVERT(VARCHAR(5),eventShifts.originalStartTime,108) as 'startTime',
// CONVERT(VARCHAR(5),eventShifts.originalFinishTime,108) as 'endTime',
// eventShifts.hourlyRate,
// events.title,
// events.subtitle,
// venues.name,
// venues.address1,
// venues.address2,
// venues.address2,
// venues.town,
// venues.county,
// venues.postcode,
// clients.clientName,
// Divisions.Description
// FROM users
// JOIN userTimesheets on userTimesheets.userID = users.id
// JOIN eventShifts on eventShifts.id = userTimesheets.eventShiftID
// JOIN events on events.id = eventShifts.eventID
// JOIN venues on events.venueID = venues.id
// JOIN clients on clients.id = events.clientID
// JOIN Divisions on Divisions.ID = eventShifts.DivisionID
// WHERE users.id = 244743
// AND events.eventDate > GETDATE()




var port = process.env.PORT || 3002;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
