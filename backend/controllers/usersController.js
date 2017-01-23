const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');


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
        return helper.errorResponse(res, 'Must provide username, name and password', 400);
    }

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password
    });

    newUser.save()
        .then(function (createdUser) {
            const token = createToken(createdUser);
            return helper.successResponse(res, {token: token}, 201);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.login = function (req, res) {
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Must provide username and password', 401);
    }

    User.findOne({username: req.body.username})
        .select('name username password role')
        .exec()
        .then(function (user) {
            if (!user || !user.comparePasswords(req.body.password)) {
                return helper.errorResponse(res, 'Invalid username or password', 401);
            }
            const token = createToken(user);
            return helper.successResponse(res, {token: token});
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.me = function (req, res) {
    return helper.successResponse(res, req.user || null);
};


exports.list = function (req, res) {
    User.find({})
        .select('name username role createdAt updatedAt')
        .sort('username')
        .exec()
        .then(function (users) {
            if (users.length == 0) {
                return helper.errorResponse(res, 'Users not found', 404);
            }
            return helper.successResponse(res, users);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = function (req, res) {
    User.findOne({_id: req.params.id})
        .select('name username role createdAt updatedAt')
        .exec()
        .then(function (user) {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }
            return helper.successResponse(res, user);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = function (req, res) {
    const newUser = new User(req.body);

    newUser.save()
        .then(function (createdUser) {
            return helper.successResponse(res, createdUser, 201);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide username, name, password', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = function (req, res) {
    User.findOne({_id: req.params.id})
        .select('name username role')
        .exec()
        .then(function (user) {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            user.username = req.body.username;
            user.name = req.body.name;
            user.role = req.body.role;

            if (req.body.password) {
                user.password = req.body.password;
            }

            user.save()
                .then(function (updatedUser) {
                    return helper.successResponse(res, updatedUser);
                })
                .catch(function (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide username, name and role', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.updateMe = function (req, res) {
    User.findOne({_id: req.user._id})
        .select('name username role')
        .exec()
        .then(function (user) {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            user.username = req.body.username;
            user.name = req.body.name;

            if (req.body.password) {
                user.password = req.body.password;
            }

            user.save()
                .then(function (updatedUser) {
                    const token = createToken(updatedUser);
                    return helper.successResponse(res, {token: token});
                })
                .catch(function (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide username and name', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = function (req, res) {
    User.findOne({_id: req.params.id})
        .exec()
        .then(function (user) {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }
            return user.remove();
        })
        .then(function () {
            return helper.successResponse(res);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
