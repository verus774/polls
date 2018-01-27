const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');
const createToken = require('./authController').createToken;


exports.list = async (req, res) => {
    const pageDefault = parseInt(req.query.page, 10) || 1;
    const limitDefault = parseInt(req.query.limit, 10) || 50;

    const select = 'name username role createdAt updatedAt';
    const sort = 'username';

    try {
        const response = await  User.paginate({}, {select, sort, page: pageDefault, limit: limitDefault});
        const {docs, total, limit, page, pages} = response;
        return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
    } catch (err) {
        return helper.errorResponse(res);
    }
};

exports.read = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).select('name username role createdAt updatedAt').exec()
        if (!user) {
            return helper.errorResponse(res, 'User not found', 404);
        }
        return helper.successResponse(res, user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.create = async (req, res) => {
    const newUser = new User(req.body);

    try {
        const createdUser = await newUser.save();
        return helper.successResponse(res, createdUser, null, 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Must provide username, name, password', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).select('name username role').exec();
        if (!user) {
            return helper.errorResponse(res, 'User not found', 404);
        }

        user.username = req.body.username;
        user.name = req.body.name;
        user.role = req.body.role;

        if (req.body.password) {
            user.password = req.body.password;
        }

        try {
            const updatedUser = await user.save();
            return helper.successResponse(res, updatedUser);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide username, name and role', 400);
            }
            return helper.errorResponse(res);
        }

    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.delete = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).exec();
        if (!user) {
            return helper.errorResponse(res, 'User not found', 404);
        }
        await user.remove();
        return helper.successResponse(res);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};
