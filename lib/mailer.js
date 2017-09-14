const fetch = require('isomorphic-fetch');

module.exports = {
  send: function(name, to, data) {
    if (process.env.MAILER_DISABLE === 'true') {
      return Promise.resolve({
        result: 'Mail would have been sent'
      });
    } else {
      return fetch(process.env.MAILER_ENDPOINT + '/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
        },
        body: JSON.stringify({
          name,
          to,
          data
        })
      });
    }
  },
  sendBatch: function(name, requests) {
    if (process.env.MAILER_DISABLE === 'true') {
      return Promise.resolve({
        result: 'Mail would have been sent'
      });
    } else {
      return fetch(process.env.MAILER_ENDPOINT + '/sendbatchmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.MAILER_AUTH_KEY
        },
        body: JSON.stringify({
          name,
          requests
        })
      });
    }
  }
}