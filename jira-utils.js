require('dotenv').config();
const axios = require('axios');

const BASE_URL = "https://oraculi.atlassian.net/rest/api/2/";
const JIRA_TICKET_BASE_URL = "https://oraculi.atlassian.net/browse"

function build_issue_request(date) {
    var request_body = {
        "fields": {
           "project":
           {
              "key": "MON"
           },
           "summary": `Incident ${date}`,
           "description": "Outage",
           "issuetype": {
              "name": "Task"
           }
       }
    }
    return request_body;
}

module.exports = {
    create_issue: function() {
        return new Promise(function(resolve, reject) {
            let date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            axios({
                "method": "POST",
                "url": `${BASE_URL}issue/`,
                "auth": {
                    "username": process.env.JIRA_USERNAME,
                    "password": process.env.JIRA_PASSWORD
                },
                "data": build_issue_request(date)
            }).then(response => {
                console.log(response.data);
                resolve(response.data);
            });
        })
    },
    get_jira_ticket_base_url: function() {
        return JIRA_TICKET_BASE_URL;
    }
}