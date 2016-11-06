var io = require('socket.io')();
var Poll = require('./models/Poll');

io.on('connection', function (socket) {
    socket.on('startPoll', function (data) {
        Poll.findOneAndUpdate({_id: data.id}, {$set: {active: true}}, {new: true}, function (err, poll) {
            io.emit('startPoll', poll);
        });
    });

    socket.on('stopPoll', function (data) {
        Poll.findOneAndUpdate({_id: data.id}, {$set: {active: false}}, {new: true}, function (err, poll) {
            data = null;
            io.emit('stopPoll', data);
        });
    });

});

module.exports = io;
