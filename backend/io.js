var io = require('socket.io')();
var Poll = require('./models/Poll');
var User = require('./models/User');
var jsonWebToken = require('jsonwebtoken');
var config = require('./config');

function getUserByToken(token, callback) {
    jsonWebToken.verify(token.substr(4), config.secretKey, function (err, decoded) {
        User.findOne({_id: decoded._id})
            .exec()
            .then(function (user) {
                return callback(null, user);
            });
    });
}

io.on('connection', function (socket) {
    socket.on('startPoll', function (data) {
        getUserByToken(data.access_token, function (err, user) {
            Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: true}}, {new: true})
                .select('title questions creator')
                .exec()
                .then(function (poll) {
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('startPoll', poll);
                })
                .catch(function () {
                    return io.in(user._id).emit('error', {message: 'server error'});
                });
        });
    });

    socket.on('stopPoll', function (data) {
        getUserByToken(data.access_token, function (err, user) {
            Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: false}}, {new: true})
                .select('title questions creator')
                .exec()
                .then(function (poll) {
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('stopPoll', poll);
                })
                .catch(function () {
                    return io.in(user._id).emit('error', {message: 'server error'});
                });
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
