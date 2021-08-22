const express = require('express');
const router = express.Router();

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
  res.send(`
    {
        "header": {
          "messageId": "99f9d8ff-9366-4cab-a90c-b4c7eca0abbe",
          "name": "DiscoverAppliancesResponse",
          "namespace": "ClovaHome",
          "payloadVersion": "1.0"
        },
        "payload": {
          "customCommands": [],
          "discoveredAppliances": [
            {
              "applianceId": "device-001",
              "manufacturerName": "device-manufacturer-name",
              "modelName": "스마트 전등",
              "version": "v1.0",
              "friendlyName": "거실 전등",
              "friendlyDescription": "스마트폰으로 제어할 수 있는 전등",
              "isIr": false,
              "actions": [
                "DecrementBrightness",
                "HealthCheck",
                "IncrementBrightness",
                "SetBrightness",
                "TurnOn",
                "TurnOff"
              ],
              "applianceTypes": ["LIGHT"],
              "additionalApplianceDetails": {}
            },
            {
              "applianceId": "device-002",
              "manufacturerName": "device-manufacturer-name",
              "modelName": "스마트 플러그",
              "version": "v1.0",
              "friendlyName": "부엌 플러그",
              "friendlyDescription": "에너지를 절약하는 플러그",
              "isIr": false,
              "actions": [
                "HealthCheck",
                "TurnOn",
                "TurnOff"
              ],
              "applianceTypes": ["SMARTPLUG"],
              "additionalApplianceDetails": {},
              "location": "LIVING_ROOM"
            }
          ]
        }
      }
    `);
}
function TurnOnRequest(req, res) {
  console.log('ON');
  res.send(`
    {
        "header": {
          "messageId": "4ec35000-88ce-4724-b7e4-7f52050558fd",
          "name": "TurnOnConfirmation",
          "namespace": "ClovaHome",
          "payloadVersion": "1.0"
        },
        "payload": {}
      }
    `);
}
function TurnOffRequest(req, res) {
  console.log('OFF');

  res.send(`
    {
        "header": {
          "messageId": "4ec35000-88ce-4724-b7e4-7f52050558fd",
          "name": "TurnOffConfirmation",
          "namespace": "ClovaHome",
          "payloadVersion": "1.0"
        },
        "payload": {}
      }
    `);
}
module.exports = router;