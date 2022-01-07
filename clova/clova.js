const express = require('express');
const router = express.Router();
const mqtt = require('mqtt');
const mqttOption = require('../secret/mqtt.json');
let client = mqtt.connect(mqttOption);
router.use(function(req,res,next){
  console.log(req.url);
  next();
});
router.post('/fulfillment', function (req, res) {
  let command = req.body.header.name;
  console.log(req.url);
  console.log(req.body);
  switch (command) {
    case "DiscoverAppliancesRequest":
      DiscoverAppliancesRequest(req, res);
      break;
    case "TurnOnRequest":
      TurnOnRequest(req, res);
      break;
    case "TurnOffRequest":
      TurnOffRequest(req, res);
      break;
    default:
      res.sendStatus(403);
      break;
  }
});

router.get('/login', function (req, res) {

  res.sendFile(__dirname+'/login.html');
});
router.post('/login', function (req, res) {
  let email = req.body.email;
  let pw = req.body.pw;
  let response_type = req.body.response_type;
  let client_id = req.body.client_id;
  let scope = req.body.scope;
  let redirect_uri = req.body.redirect_uri;
  let state = req.body.state;

  let url = decodeURIComponent(redirect_uri)+"?state="+state+"&code="+"FakeToken"+"&token_type=Bearer";
  console.log(url);
  res.redirect(url);
});
router.post('/token',function(req,res){
  console.log('post');
  console.log(req.body);
  res.send(`
  {
    "access_token":"fakeAccess",
    "refresh_token":"fakeRefresh"
  }
  `);
});
function DiscoverAppliancesRequest(req, res) {
  console.log('Discover');
  let messageId = req.body.header.messageId;

  let resultObject = new Object();
  resultObject.header = new Object();
  resultObject.header.messageId = messageId;
  resultObject.header.name = "smart home";
  resultObject.header.namespace = "smart home";
  resultObject.header.payloadVersion = "1.0";
  resultObject.payload = new Object();
  resultObject.payload.discoveredAppliances = new Array();

  let switchbot = new Object();
  switchbot.applianceId = "ESP32-000001";
  switchbot.manufacturerName = "Arduino";
  switchbot.modelName = "ESP32";
  switchbot.friendlyName = "부엌 불";
  switchbot.isIr = false;
  switchbot.actions = ["TurnOn", "TurnOff"];
  switchbot.applianceTypes = ["SWITCH"];
  resultObject.payload.discoveredAppliances.push(switchbot);

  res.send(resultObject);
}
function TurnOnRequest(req, res) {
  console.log('ON');
  client.publish("iot/switch/kitchen", "ON");

  let applianceId = req.body.payload.appliance.applianceId;
  let messageId = req.body.header.messageId;
  
  let resultObject = new Object();
  resultObject.header = new Object();
  resultObject.header.messageId = req.body.header.messageId;
  resultObject.header.name = "TurnOnConfirmation";
  resultObject.header.payloadVersion = "1.0";
  resultObject.payload = new Object();
  res.send(resultObject);
    
}
function TurnOffRequest(req, res) {
  console.log('OFF');
  client.publish("iot/switch/kitchen", "OFF");

  let applianceId = req.body.payload.appliance.applianceId;
  let messageId = req.body.header.messageId;

  let resultObject = new Object();
  resultObject.header = new Object();
  resultObject.header.messageId = req.body.header.messageId;
  resultObject.header.name = "TurnOffConfirmation";
  resultObject.header.payloadVersion = "1.0";
  resultObject.payload = new Object();
  res.send(resultObject);
}
module.exports = router;