const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.dbUrl)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error(err);
    });
