var io = require('socket.io')();
var Poll = require('./models/Poll');

io.on('connection', function (socket) {
    socket.on('startPoll', function (data) {
        Poll.findOneAndUpdate({_id: data.id}, {$set: {active: true}}, {new: true})
            .select('title questions creator')
            .exec()
            .then(function (poll) {
                io.in(poll.creator).emit('startPoll', poll);
            })
            .catch(function (err) {
                io.in(poll.creator).emit('error', {message: err.name});
            });
    });

    socket.on('stopPoll', function (data) {
        Poll.findOneAndUpdate({_id: data.id}, {$set: {active: false}}, {new: true})
            .exec()
            .then(function (poll) {
                io.in(poll.creator).emit('stopPoll', null);
            })
            .catch(function (err) {
                io.in(poll.creator).emit('error', {message: err.name});
            });
    });

    socket.on('answers', function (data) {
        data.ip = socket.handshake.address;
        io.emit('answers', data);
    });

    socket.on('joinRoom', function (data) {
        socket.join(data);
    });

    socket.on('leaveRoom', function (data) {
        socket.leave(data);
    });

});

module.exports = io;
