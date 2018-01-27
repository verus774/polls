const User = require('../models/User');
const helper = require('./helperController');
const createAccessToken = require('./authController').createAccessToken;


exports.me = (req, res) => {
    return helper.successResponse(res, req.user || null);
};

exports.updateMe = async (req, res) => {
    const user = await User.findOne({_id: req.user._id}).select('name username role').exec();
    if (!user) {
        return helper.errorResponse(res, 'User not found', 404);
    }

    user.username = req.body.username;
    user.name = req.body.name;

    if (req.body.password) {
        user.password = req.body.password;
    }

    try {
        const updatedUser = await user.save();
        const token = await createAccessToken(updatedUser);
        return helper.successResponse(res, {token});
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Must provide username and name', 400);
        }
        return helper.errorResponse(res);
    }
};
