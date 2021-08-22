const { smarthome } = require('actions-on-google');
const express = require('express');

const router = express.Router();
const app = smarthome();

app.onSync((body, headers) => {
    console.log("onSync");
    return {
        "requestId": body.requestId,
        "payload": {
            "agentUserId": "YOUR_ID",
            "devices": [
                {
                    "id": "123",
                    "type": "action.devices.types.SWITCH",
                    "traits": [
                        "action.devices.traits.OnOff"
                    ],
                    "name": {
                        "name": "Simple switch"
                    },
                    "willReportState": true,
                    "deviceInfo": {
                        "manufacturer": "smart-home-inc",
                        "model": "hs1234"
                    }
                }
            ]
        }
    }
})
app.onQuery((body, headers) => {
    console.log("onQuery");
    return {
        requestId: body.requestId,
        payload: {
            "devices": {
                "123": {
                    "status": "SUCCESS",
                    "online": true,
                    "on": true
                }
            },
        }
    }
})
app.onExecute((body, headers) => {
    console.log("onExecute");
    return {
        requestId: body.requestId,
        payload: {
            "commands": [
                {
                    "ids": [
                        "123"
                    ],
                    "status": "SUCCESS",
                    "states": {
                        "online": true,
                        "on": true
                    }
                }
            ]
        }
    }
})
app.onDisconnect((body, headers) => {
    console.log("onDisconnect");
    return {}
})

router.get('/auth', function (req, res) {
    console.log(req.query.client_id);
    console.log(req.query.redirect_uri);
    console.log(req.query.state);
    // console.log(req.query.redirect_uri+"?code=MINGKYME23&state="+req.query.state);
    // res.redirect(req.query.redirect_uri+"?code=MINGKYME23&state="+req.query.state);
    let url = req.query.redirect_uri + "?code=MINGKYME23&state=" + req.query.state;
    res.redirect('/login?responseurl=' + encodeURIComponent(url));
});
router.get('/login', function (req, res) {
    res.send(`
    <html>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <body>
          <form action="/login" method="post">
            <input type="hidden"
              name="responseurl" value="${req.query.responseurl}" />
            <button type="submit" style="font-size:14pt">
              Link this service to Google
            </button>
          </form>
        </body>
      </html>
      `);
});
router.post('/login', function (req, res) {
    // Here, you should validate the user account.
    // In this sample, we do not do that.
    console.log(req.body);
    res.redirect(decodeURIComponent(req.body.responseurl));
});
router.get('/token', function (req, res) {
    console.log(req);
    console.log("test");
});
router.post('/token', function (req, res) {
    console.log("TOKEN");
    console.log(req.body.client_id);
    console.log(req.body.redirect_uri);
    console.log(req.body.state);
    res.send({
        "token_type": "Bearer",
        "access_token": "123access",
        "refresh_token": "123refresh",
        "expires_in": 86400
    });
});
router.post('/fulfillment', app);
module.exports = router;
