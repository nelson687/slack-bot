require('dotenv').config();

const Slack = require('slack');

const https = require('https');
const qs = require('querystring');
const VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
const ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN;

const jira_utils = require("./jira-utils");

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
function processEvent(event, callback) {
  if (!event.bot_id && /(escucha)/ig.test(event.text)) {
      var text = `<@${event.user}> escucho todos los mensajes!!`;
      var message = { 
          token: ACCESS_TOKEN,
          channel: event.channel,
          text: text
      };

      Slack.chat.postMessage(message);
  } else if (!event.bot_id && /(new incident)/ig.test(event.text)) {
     
      var message = { 
          token: ACCESS_TOKEN,
          channel: event.channel,
          text: ''
      };

      message.text = "Creating jira issue!";
      Slack.chat.postMessage(message);
      jira_utils.create_issue()
        .then(function(data) {
          message.text = `<@${event.user}> Jira ticket created! ${jira_utils.get_jira_ticket_base_url()}/${data.key}`;
           Slack.chat.postMessage(message);
        })
  }

  response.body = JSON.stringify("ok");
  callback(null, response);
}


module.exports.run = (event, context, callback) => {
  // let body = JSON.parse(event.body);
  console.log("RUN STARTING!!!!!!")
  let body = event.body;
  console.log(body)
  switch (body.type) {
    case "url_verification": response.body = verify(body); break;
    case "event_callback":
        processEvent(body.event, callback);
        break;
    default: 
        response.body = JSON.stringify("Bad request");
        callback(null, response);
        break;
  }
};
