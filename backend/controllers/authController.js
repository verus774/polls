const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');

exports.createToken = (user) => {
    return 'JWT ' + jsonWebToken.sign({
                _id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }, config.secretKey,
            {expiresIn: config.tokenExpiresIn}
        );
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
        .then((createdUser) => {
            const token = this.createToken(createdUser);
            return helper.successResponse(res, {token: token}, null, 201);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                return helper.errorResponse(res, 'username exists', 409);
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
            const token = this.createToken(user);
            return helper.successResponse(res, {token: token});
        })
        .catch(_ => helper.errorResponse(res));
};