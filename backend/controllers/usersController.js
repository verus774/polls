var User = require('../models/User');
var jsonWebToken = require('jsonwebtoken');
var config = require('../config');
var helper = require('./helperController');


function createToken(user) {
    return 'JWT ' + jsonWebToken.sign({
                _id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }, config.secretKey,
            {expiresIn: config.tokenExpiresIn}
        );
}

exports.signup = function (req, res) {
    if (!(req.body.username || req.body.name || req.body.password)) {
        return helper.errorResponse(res, 'Pass username, name and password', 400);
    }

    var newUser = new User({
        username: req.body.username,
        name: req.body.name,
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
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Empty username or password', 401);
    }

    User.findOne({username: req.body.username})
        .select('name username password role')
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
        .sort('username')
        .exec(function (err, users) {
            if (err) {
                return helper.errorResponse(res);
            } else if (users.length == 0) {
                return helper.errorResponse(res, 'Users not found', 404);
            }

            return helper.successResponse(res, users);
        });
};

exports.read = function (req, res) {
    User.findOne({_id: req.params.id})
        .select('name username role')
        .exec(function (err, user) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            return helper.successResponse(res, user);
        });
};

exports.create = function (req, res) {
    var newUser = new User(req.body);

    newUser.save(function (err, createdUser) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide username, name, password', 400);
            }
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, createdUser, 201);
    });
};

exports.update = function (req, res) {
    User.findOne({_id: req.user._id})
        .exec(function (err, user) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            user.username = req.body.username;
            user.name = req.body.name;
            user.password = req.body.password;

            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res, user);
            });
        });

};

exports.delete = function (req, res) {
    User.findOne({_id: req.params.id})
        .exec(function (err, user) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            user.remove(function (err) {
                if (err) {
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res);
            });
        });
};
