const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path : "./Configuration/config.env"});
const {google} = require("googleapis");

const CLIENT_ID = process.env.ID;
const CLIENT_SECRET = process.env.SECRET;
const REDIRECT_URI = process.env.URI;
const REFRESH_TOKEN = process.env.TOKEN;


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN});

const gmail = google.gmail({
    version : "v1",
    auth : oAuth2Client
});


const mail = async  () =>{
    const res = await gmail.users.messages.list({
        userId: 'me'
    });
    res.data.messages.forEach(data => {
        getMessages(data.id,data.threadId);
    })
}

const emails = [];
const getMessages = async (id) =>{
    const data = {};
    const email = await gmail.users.messages.get({
        userId : "me" ,
        id : id
    });
    data.id = email.data.id;
    data.message = email.data.snippet;
    emails.push(data);
}


mail().catch(console.error);

app.use("/api/v1/getemails",((req, res) => {
    return res.status(200).json(emails);
}));


const PORT = 8000 || process.env.PORT;
app.listen(PORT,()=>console.log(`Server Started At ${PORT}`));

/*
API =
{
  config: {
    url : ,
    method: 'GET',
    userAgentDirectives: [ [Object] ],
    paramsSerializer: [Function (anonymous)],
    headers: {
      'x-goog-api-client': 'gdcl/5.0.2 gl-node/15.5.1 auth/7.1.2',
      'Accept-Encoding': 'gzip',
      'User-Agent': 'google-api-nodejs-client/5.0.2 (gzip)',
      Authorization: 'Bearer gD1jYX0iQXjBo-6uXg',
      Accept: 'application/json'
    },
    params: {},
    validateStatus: [Function (anonymous)],
    retry: true,
    responseType: 'json'
  },
  data: {
    id: '17a015cf2c633bae',
    threadId: '178ff101b932f4ac',
    labelIds: [ 'IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX' ],
    snippet: 'I&#39;m doing alright. I started learning to play the ukulele which is fun. How are you? On Thu, Jun 10, 2021 at 7:42 AM Enforc3rr &lt;enforc3rr@gmail.com&gt; wrote: Hey Jester, How are you? Sorry for',
    payload: {
      partId: '',
      mimeType: 'multipart/alternative',
      filename: '',
      headers: [Array],
      body: [Object],
      parts: [Array]
    },
    sizeEstimate: 21653,
    historyId: '11640',
    internalDate: '1623520495000'
  },
  headers: {
    'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-T051=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
    'cache-control': 'private',
    connection: 'close',
    'content-encoding': 'gzip',
    'content-type': 'application/json; charset=UTF-8',
    date: 'Fri, 18 Jun 2021 11:45:55 GMT',
    server: 'ESF',
    'transfer-encoding': 'chunked',
    vary: 'Origin, X-Origin, Referer',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-xss-protection': '0'
  },
  status: 200,
  statusText: 'OK',
  request: {
    responseURL: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/17a'
  }
}

 */
