'use strict';

const https = require('https'),
      qs = require('querystring'),
      VERIFICATION_TOKEN = "wdyBeIKGCREec97SaqR0r7oJ",
      ACCESS_TOKEN = "xoxb-401801756722-990284655665-BhTGrRNNhVEl0AHNxuvSjpsz";

function verify(data) {
    if (data.token === VERIFICATION_TOKEN) {
        return data.challenge;
    }
    else return "verification failed ffs";
}

let response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  },
  body:{},
};

module.exports.run = (event, context, callback) => {
  let body = JSON.parse(event.body);
    
  switch (body.type) {
    case "url_verification": response.body = verify(body); break;
    case "event_callback": 
        // await process(body.event);
        response.body = {ok: true};
        break;
    default: response.body = JSON.stringify("Bad request"); break;
  }

  // response.body = JSON.stringify("esa nelsoooon")

  callback(null, response);
};
