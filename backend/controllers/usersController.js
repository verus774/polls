var User = require('../models/User');
var jsonWebToken = require('jsonwebtoken');
var config = require('../config');
var helper = require('./helperController');


function createToken(user) {
    return 'JWT ' + jsonWebToken.sign({
                _id: user._id,
                name: user.name,
                username: user.username
            }, config.secretKey,
            {expiresIn: config.tokenExpiresIn}
        );
}

exports.signup = function (req, res) {
    // TODO
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Pass username and password', 400);
    }

    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err, createdUser) {
        if (err) {
            return helper.errorResponse(res);
        }
        var token = createToken(createdUser);
        return helper.successResponse(res, {token: token}, 201);
    });

};

exports.login = function (req, res) {
    // TODO
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Empty username or password', 401);
    }

    User.findOne({username: req.body.username})
        .select('name username password')
        .exec(function (err, user) {
            if (!user || !user.comparePasswords(req.body.password)) {
                return helper.errorResponse(res, 'Invalid username or password', 401);
            } else {
                var token = createToken(user);
                return helper.successResponse(res, {token: token});
            }
        });
};

exports.me = function (req, res) {
    return helper.successResponse(res, req.user || null);
};

exports.list = function (req, res) {
    User.find({})
        .select('name username role')
        .exec(function (err, users) {
            if (err) {
                return helper.errorResponse(res);
            } else if (users.length == 0) {
                return helper.errorResponse(res, 'Users not found', 404);
            }

            return helper.successResponse(res, users);
        });
};
