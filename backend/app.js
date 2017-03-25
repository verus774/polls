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
const cors = require('cors');
require('./io').attach(server);

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport')(passport);

app.use(express.static(path.join(__dirname, config.serveStatic)));

app.use('/auth', auth);
app.use('/api/v1', apiV1);

server.listen(config.port, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Listening on port ' + config.port);
    }
});
