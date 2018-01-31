const io = require('socket.io')();
const Poll = require('./models/Poll');
const config = require('./config');
const {verify} = require('jsonwebtoken');
const {promisify} = require('util');
const verifyToken = promisify(verify);

const selectedFields = 'title questions creator';

io.on('connection', (socket) => {
    socket.on('startPoll', async (data) => {
        try {
            const accessToken = data.access_token || '';
            const user = await verifyToken(accessToken.substr(4), config.accessTokenSecretKey);
            try {
                const poll = await Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: true}}, {new: true})
                    .select(selectedFields)
                    .exec();
                if (!poll) {
                    return io.in(user._id).emit('appError', {message: 'poll not found'});
                }
                return io.in(user._id).emit('startPoll', poll);
            } catch (err) {
                return io.in(user._id).emit('appError', {message: 'server error'});
            }
        } catch (err) {
            socket.emit('appError', {message: err.message});
        }
    });

    socket.on('stopPoll', async (data) => {
        try {
            const accessToken = data.access_token || '';
            const user = await verifyToken(accessToken.substr(4), config.accessTokenSecretKey);
            try {
                const poll = await Poll.findOneAndUpdate({_id: data.id, creator: user._id}, {$set: {active: false}}, {new: true})
                    .select(selectedFields)
                    .exec();
                if (!poll) {
                    return io.in(user._id).emit('appError', {message: 'poll not found'});
                }
                return io.in(user._id).emit('stopPoll', poll);
            } catch (err) {
                return io.in(user._id).emit('appError', {message: 'server error'});
            }
        } catch (err) {
            socket.emit('appError', {message: err.message});
        }
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
