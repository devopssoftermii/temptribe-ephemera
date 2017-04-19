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

// dotenv.load();

var config = {
    user: 'mb_admin',
    password: 'mb_admin_pwd1',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'LolaLocal'
}

var secret = '29dj9h2ieIJjoAWDJA'

var jwtCheck = jwt({
  secret: secret
});

function createToken(user) {
  return jwt_generator.sign(_.omit(user, 'password'), secret, { expiresIn: 60*60*1000000 });
}

app.use(bodyParser.json());

app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

// if (process.env.NODE_ENV === 'development') {
//   app.use(logger('dev'));
//   app.use(errorhandler())
// }

app.get('/api/v1/test', function(req, res) {
	res.type('json').status(200).send(JSON.stringify({
	  data: "hello world"
	}));
})


app.post('/api/v1/login', function(req, res) {
  console.log(req.url)
  var email = null
  var password = null
  var user = null
  if(req.body.email && req.body.password) {
    email = req.body.email;
    password = req.body.password;
  }
  if (!email || !password) {
    return res.type('json').status(400).send(JSON.stringify({
      error: "Give us a username and password!"
    }));
  }

  user = {
    email: email,
    password: password,
    id: null
  }

  sql.connect(config)
  .then(function() {
    var request = new sql.Request();
    request.input('email', email );
    request.input('password', password);
    request.query(
        `SELECT id FROM users WHERE email=@email AND password=@password`
    )
    .then(function(recordset) {
    	if (recordset[0]) {
    		res.type('json').status(201).send(
			    JSON.stringify({
			      id_token: createToken({
			      	email: email,
			      	id: recordset[0].id
			      }),
			      userID: recordset[0].id,
			      error: null
			    })
			)
    	} else {
    		res.type('json').status(401).send(JSON.stringify({
		      error: "password or username is just wrong!"
		    }));
    	}
    })
    .catch(function(err) {
      console.log('Request error: ' + err);
      	res.type('json').status(500).send(JSON.stringify({
		      error: "code-E1"
		    }));	
    });
  })
  .catch(function(err) {
      console.log('there was an err', err)
      res.type('json').status(500).send(JSON.stringify({
		      error: "code-E1"
		    }));
  });

});

app.use('/api/v1/', jwtCheck);

app.get('/api/v1/user/:userID/events', function(req, res) {
	console.log(req.url)
	if (req.user.id.toString() === req.params.userID.toString()) {
	  sql.connect(config)
	  .then(function() {
	    var request = new sql.Request();
	    request.input('userID', req.params.userID);
	    request.query(
	        `SELECT 
			users.id,
			eventShifts.id as shiftID,
			userTimesheets.status as status,
			CONVERT(date ,events.eventDate) as eventDate,
			CONVERT(VARCHAR(5),eventShifts.originalStartTime,108) as 'startTime',
			CONVERT(VARCHAR(5),eventShifts.originalFinishTime,108) as 'endTime',
			eventShifts.originalStartTime,
			eventShifts.originalFinishTime,
			eventShifts.hourlyRate,
			events.id as eventID,
			events.comments as eventInternalComments,
			events.title,
			events.subtitle,
			venues.name as venueName,
			venues.address1,
			venues.address2,
			venues.town,
			venues.county,
			venues.postcode,
			venues.mapLink,
			('/images/venuePhotos/' + convert(varchar(10), venues.id) + '.jpg') AS venueImageURL,
			clients.clientName,
			dressCodes.ShortDescription as dressCodeShortDescription,
			dressCodes.description as dressCodeDescription,
			jobRoles.title as jobRole
			FROM users
			JOIN userTimesheets on userTimesheets.userID = users.id 
			JOIN eventShifts on eventShifts.id = userTimesheets.eventShiftID
			JOIN events on events.id = eventShifts.eventID
			JOIN venues on events.venueID = venues.id
			JOIN clients on clients.id = events.clientID
			JOIN dressCodes on dressCodes.id = eventShifts.dressCodeID
			JOIN jobRoles on jobRoles.id = eventShifts.jobRoleID
			WHERE users.id = @userID
			AND userTimesheets.status in (4)
			AND events.eventDate >= CONVERT(date, getdate())
			ORDER BY events.eventDate ASC`
	    )
	    .then(function(recordset) {
			res.type('json').status(200).send(
			    JSON.stringify(recordset)
			)
	    })
	    .catch(function(err) {
	      console.log('Request error: ' + err);
	    });
	 })
	  .catch(function(err) {
	      console.log('there was an err', err)
	  });
	} else {
		res.type('json').status(401).send(
		    JSON.stringify({error: 'access denied'})
		)
	}
});

app.get('/api/v1/user/:userID/profile', function(req, res) {
	console.log(req.url)
	if (req.user.id.toString() === req.params.userID.toString()) {
	  sql.connect(config)
	  .then(function() {
	  	console.log('HERE')
	    var request = new sql.Request();
	    request.input('userID', req.params.userID);
	    request.query(
	        `SELECT TOP 1 
			users.id as userID, 
			users.firstname, 
			users.surname,
			users.email,
			users.mobile,
			userPhotos.FileName as imageFileName
			FROM users
			JOIN userPhotos on users.id = userPhotos.UserID
			WHERE users.id = @userID
			AND userPhotos.IsMainImage = 1`
	    )
	    .then(function(recordset) {
			res.type('json').status(200).send(
			    JSON.stringify(recordset[0])
			)
	    })
	    .catch(function(err) {
	      console.log('Request error: ' + err);
	    });
	 })
	  .catch(function(err) {
	      console.log('there was an err', err)
	  });
	} else {
		res.type('json').status(401).send(
		    JSON.stringify({error: 'access denied'})
		)
	}
});

var port = process.env.PORT || 3002;

http.createServer(app).listen(port, function (err) {
  console.log('listening on http://localhost:' + port);
});

