'use strict';

const Slack = require('slack');

const https = require('https'),
      qs = require('querystring'),
      VERIFICATION_TOKEN = "",
      ACCESS_TOKEN = "";

function verify(data, callback) {
    if (data.token === VERIFICATION_TOKEN) {
        return callback(null, data.challenge);
    }
    else return callback("verification failed ffs");
}

let response = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'X-Slack-No-Retry': 1,
  },
  body:{},
};

// Post message to Slack - https://api.slack.com/methods/chat.postMessage
function process(event, callback) {
  if (!event.bot_id && /(listen)/ig.test(event.text)) {
      var text = `<@${event.user}> I listen to the messages!!`;
      var message = { 
          token: ACCESS_TOKEN,
          channel: event.channel,
          text: text
      };

      Slack.chat.postMessage(message);
  }

  response.body = JSON.stringify("ok");
  callback(null, response);
}


module.exports.run = (event, context, callback) => {
  let body = JSON.parse(event.body);
  console.log("RUN STARTING!!!!!!")
  // let body = event.body;
  console.log(body)
  switch (body.type) {
    case "url_verification": response.body = verify(body); break;
    case "event_callback":
        process(body.event, callback);
        break;
    default: 
        response.body = JSON.stringify("Bad request");
        callback(null, response);
        break;
  }
};
