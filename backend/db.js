const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {useMongoClient: true})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error(err);
    });
