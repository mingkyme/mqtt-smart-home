const PORT = 3000;
const express = require('express');

const googleApp = require('./google/google');
const clovaApp = require('./clova/clova');

const app = express();
const router = express.Router();
// HTTPS Mode
/*
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('../privkey.pem'),
    cert: fs.readFileSync('../cert.pem'),
    ca: fs.readFileSync('../fullchain.pem')
};
https.createServer(options, app).listen(PORT);
*/

// HTTP Mode
app.listen(PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/google', googleApp);
app.use('/clova', clovaApp);
