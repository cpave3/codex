'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of type application/json
app.use(bodyParser.json());

// Configure the database

const appConfig = require('./config/app.config.js');
const mongoose = require('mongoose');
const messages = require('./app/messages.js');

mongoose.Promise = global.Promise;

mongoose.connect(appConfig.database.url);

mongoose.connection.on('error', () => {
    console.log(messages.database.connectionFail);
});

mongoose.connection.once('open', () => {
    console.log(messages.database.connectionSuccess);
});

// Define a simple route
app.get('/', (req, res) => {
    res.json({'message': 'Hello World'})
});

// Import all Routes
require('./app/routes/user.routes.js')(app);

// listen for requests
app.listen(appConfig.general.port, () => {
    console.log('[*] Listening on ' + appConfig.general.port);
});
