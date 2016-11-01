var express = require('express');
var app = express();
var config = require('./config');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var auth = require('./routes/auth')(express);
var apiV1 = require('./routes/api-v1')(express, passport);

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, function(err) {
    if(err) {
        console.error(err);
    } else {
        console.log('Connected to the database');
    }
});

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport')(passport);

app.use(express.static('../frontend'));

app.use('/auth', auth);
app.use('/api/v1', apiV1);

app.listen(config.port, function(err) {
    if(err) {
        console.error(err);
    } else {
        console.log('Listening on port ' + config.port);
    }
});
