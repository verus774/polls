var express = require('express');
var app = express();
var config = require('./config');
var apiV1 = require('./routes/api-v1')(express);


app.use('/api/v1', apiV1);

app.listen(config.port, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Listening on port ' + config.port);
    }
});
