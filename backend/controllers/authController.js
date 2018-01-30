const User = require('../models/User');
const jsonWebToken = require('jsonwebtoken');
const config = require('../config');
const helper = require('./helperController');


exports.signup = async (req, res) => {
    if (!(req.body.username || req.body.name || req.body.password)) {
        return helper.errorResponse(res, 'Must provide username, name and password', 400);
    }

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password
    });

    try {
        const createdUser = await newUser.save();
        const result = await Promise.all([
            createdUser.createAccessToken(),
            createdUser.createRefreshToken()
        ]);

        return helper.successResponse(res, {accessToken: result[0], refreshToken: result[1]}, null, 201);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return helper.errorResponse(res, 'Username exists', 409);
        }
        return helper.errorResponse(res);
    }
};

exports.login = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return helper.errorResponse(res, 'Must provide username and password', 401);
    }

    try {
        const user = await User.findOne({username: req.body.username}).select('name username password role').exec();
        if (!user || !user.comparePasswords(req.body.password)) {
            return helper.errorResponse(res, 'Invalid username or password', 401);
        }

        const result = await Promise.all([
            user.createAccessToken(),
            user.createRefreshToken()
        ]);

        return helper.successResponse(res, {accessToken: result[0], refreshToken: result[1]})
    } catch (err) {
       return helper.errorResponse(res);
    }
};

exports.refreshToken = (req, res) => {
    const token = req.body.refreshToken.substr(4);

    if (!token) {
        return helper.errorResponse(res);
    }

    jsonWebToken.verify(token, config.refreshTokenSecretKey, async (err, decoded) => {
        if (err) {
            return helper.errorResponse(res);
        }

        try {
            const user = await User.findById(decoded._id).select('name username role token').exec();
            if (!user || (token !== user.token)) {
                return helper.errorResponse(res);
            }

            const result = await Promise.all([
                user.createAccessToken(),
                user.createRefreshToken()
            ]);

            return helper.successResponse(res, {accessToken: result[0], refreshToken: result[1]});
        } catch (err) {
            return helper.errorResponse(res);
        }

    });
};
