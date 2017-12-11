const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');
const createToken = require('./authController').createToken;


exports.list = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    const select = 'name username role createdAt updatedAt';
    const sort = 'username';

    User.paginate({}, {select, page, limit, sort})
        .then(response => {
            let {docs, total, limit, page, pages} = response;
            return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
        })
        .catch(_ => helper.errorResponse(res));
};

exports.read = (req, res) => {
    User.findOne({_id: req.params.id})
        .select('name username role createdAt updatedAt')
        .exec()
        .then((user) => {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }
            return helper.successResponse(res, user);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = (req, res) => {
    const newUser = new User(req.body);

    newUser.save()
        .then((createdUser) => {
            return helper.successResponse(res, createdUser, null, 201);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide username, name, password', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = (req, res) => {
    User.findOne({_id: req.params.id})
        .select('name username role')
        .exec()
        .then((user) => {
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
                .then((updatedUser) => {
                    return helper.successResponse(res, updatedUser);
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide username, name and role', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = (req, res) => {
    User.findOne({_id: req.params.id})
        .exec()
        .then((user) => {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }
            return user.remove();
        })
        .then(_ => helper.successResponse(res))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
