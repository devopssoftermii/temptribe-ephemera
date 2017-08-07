const fetch = require('fetch');
const config = require('./config');

module.exports = {
  send: function(smartEmailID, to, data) {
    return fetch(process.env.MAILER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
      },
      body: JSON.stringify({
        smartEmailID,
        to,
        data
      })
    });
  }
}