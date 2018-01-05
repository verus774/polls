const io = require('socket.io')();
const Poll = require('./models/Poll');
const User = require('./models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('./config');

function getUserByToken(token, callback) {
    jsonWebToken.verify(token.substr(4), config.accessTokenSecretKey, (err, decoded) => {
        User.findOne({_id: decoded._id})
            .exec()
            .then((user) => {
                return callback(null, user);
            });
    });
}

io.on('connection', (socket) => {
    socket.on('startPoll', (data) => {
        getUserByToken(data.access_token, (err, user) => {
            Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: true}}, {new: true})
                .select('title questions creator')
                .exec()
                .then((poll) => {
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('startPoll', poll);
                })
                .catch(() => {
                    return io.in(user._id).emit('error', {message: 'server error'});
                });
        });
    });

    socket.on('stopPoll', (data) => {
        getUserByToken(data.access_token, (err, user) => {
            Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: false}}, {new: true})
                .select('title questions creator')
                .exec()
                .then((poll) => {
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('stopPoll', poll);
                })
                .catch(() => {
                    return io.in(user._id).emit('error', {message: 'server error'});
                });
        });
    });

    socket.on('answers', (data) => {
        data.ip = socket.handshake.address;
        io.emit('answers', data);
    });

    socket.on('joinRoom', (data) => {
        socket.join(data);
    });

    socket.on('leaveRoom', (data) => {
        socket.leave(data);
    });

});

module.exports = io;
