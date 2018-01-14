const express = require('express');
const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const passport = require('passport');
const auth = require('./routes/auth');
const apiV1 = require('./routes/api-v1');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('./db');
const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
    page: 1,
    limit: 2,
    lean: true,
    leanWithId: false
};

app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./passport')(passport);

app.use(express.static(path.join(__dirname, config.serveStatic)));

app.use('/auth', auth);
app.use('/api/v1', apiV1);

module.exports = app;
