const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');

exports.createAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jsonWebToken.sign({
                _id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            },
            config.accessTokenSecretKey,
            {expiresIn: config.accessTokenExpiresIn},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve('JWT ' + token);
            }
        );
    });
};

exports.createRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        jsonWebToken.sign({_id: user._id},
            config.refreshTokenSecretKey,
            {expiresIn: config.refreshTokenExpiresIn},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                User.findOneAndUpdate({_id: user._id}, {$set: {token}})
                    .exec()
                    .then(() => resolve('JWT ' + token));
            }
        );
    });
};

exports.signup = (req, res) => {
    if (!(req.body.username || req.body.name || req.body.password)) {
        return helper.errorResponse(res, 'Must provide username, name and password', 400);
    }

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password
    });

    newUser.save()
        .then((createdUser) => Promise.all([
            this.createAccessToken(createdUser),
            this.createRefreshToken(createdUser)
        ]))
        .then((result) => helper.successResponse(res, {accessToken: result[0], refreshToken: result[1]}, null, 201))
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                return helper.errorResponse(res, 'Username exists', 409);
            }
            return helper.errorResponse(res);
        });
};

exports.login = (req, res) => {
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Must provide username and password', 401);
    }

    User.findOne({username: req.body.username})
        .select('name username password role')
        .exec()
        .then((user) => {
            if (!user || !user.comparePasswords(req.body.password)) {
                return helper.errorResponse(res, 'Invalid username or password', 401);
            }
            return user;
        })
        .then((user) => Promise.all([
            this.createAccessToken(user),
            this.createRefreshToken(user)
        ]))
        .then((result) => helper.successResponse(res, {accessToken: result[0], refreshToken: result[1]}))
        .catch(() => helper.errorResponse(res));
};
