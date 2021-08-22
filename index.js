const PORT = 3000;
const express = require('express');
const https = require('https');
const fs = require('fs');

const googleApp = require('./google/google');
const clovaApp = require('./clova/clova');

const app = express();
const router = express.Router();
const options = {
    key: fs.readFileSync('../privkey.pem'),
    cert: fs.readFileSync('../cert.pem'),
    ca: fs.readFileSync('../fullchain.pem')
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/google', googleApp);
app.use('/clova', clovaApp);

https.createServer(options, app).listen(PORT);