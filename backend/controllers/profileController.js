const User = require('../models/User');
const helper = require('./helperController');
const createToken = require('./authController').createToken;


exports.me = (req, res) => {
    return helper.successResponse(res, req.user || null);
};

exports.updateMe = (req, res) => {
    User.findOne({_id: req.user._id})
        .select('name username role')
        .exec()
        .then((user) => {
            if (!user) {
                return helper.errorResponse(res, 'User not found', 404);
            }

            user.username = req.body.username;
            user.name = req.body.name;

            if (req.body.password) {
                user.password = req.body.password;
            }

            user.save()
                .then(updatedUser => createToken(updatedUser))
                .then((token) => helper.successResponse(res, {token}))
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide username and name', 400);
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
