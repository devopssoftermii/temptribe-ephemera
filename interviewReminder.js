// Import config into process.env
require('dotenv-safe').config();
const ClientError = require('./lib/errors/ClientError');
const mailer = require('./lib/mailer');

var app = {
  locals: {}
}

// Initialise DB
require('./data')(app);

mailer.sendBatch('newApplicant', [
  {
    to: 'ashleigh+1@temptribe.co.uk',
    data: {
      firstname: 'foo',
      url: 'doom'
    }
  },
  {
    to: 'ashleigh+2@temptribe.co.uk',
    data: {
      firstname: 'bar',
      url: 'doom'
    }
  },
  {
    to: 'ashleigh+3@temptribe.co.uk',
    data: {
      firstname: 'baz',
      url: 'doom'
    }
  },
]);

