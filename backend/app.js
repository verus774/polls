const express = require('express');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('./routes/auth')(express, passport);
const apiV1 = require('./routes/api-v1')(express, passport);
const path = require('path');
const server = require('http').Server(app);
const helmet = require('helmet');
require('./io').attach(server);

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, function(err) {
    if(err) {
        console.error(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport')(passport);

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/auth', auth);
app.use('/api/v1', apiV1);

server.listen(config.port, function (err) {
    if(err) {
        console.error(err);
    } else {
        console.log('Listening on port ' + config.port);
    }
});
