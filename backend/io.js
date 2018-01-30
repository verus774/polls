const io = require('socket.io')();
const Poll = require('./models/Poll');
const User = require('./models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('./config');

const selectedFields = 'title questions creator';

io.on('connection', (socket) => {
    socket.on('startPoll', (data) => {
        jsonWebToken.verify(data.access_token.substr(4), config.accessTokenSecretKey, async (err, user) => {
            if (!err) {
                try {
                    const poll = await Poll.findOneAndUpdate({
                        _id: data.id,
                        creator: user._id
                    }, {$set: {active: true}}, {new: true})
                        .select(selectedFields)
                        .exec();
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('startPoll', poll);
                } catch (err) {
                    return io.in(user._id).emit('error', {message: 'server error'});
                }
            }
        });
    });

    socket.on('stopPoll', (data) => {
        jsonWebToken.verify(data.access_token.substr(4), config.accessTokenSecretKey, async (err, user) => {
            if (!err) {
                try {
                    const poll = await Poll.findOneAndUpdate({
                        _id: data.id,
                        creator: user._id
                    }, {$set: {active: false}}, {new: true})
                        .select(selectedFields)
                        .exec();
                    if (!poll) {
                        return io.in(user._id).emit('error', {message: 'poll not found'});
                    }
                    return io.in(user._id).emit('stopPoll', poll);
                } catch (err) {
                    return io.in(user._id).emit('error', {message: 'server error'});
                }
            }
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
