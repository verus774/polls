var User = require('../models/User');
var helper = require('./helperController');

exports.list = function (req, res) {
    User.find({})
        .select('name')
        .exec(function (err, users) {
            if (err) {
                return helper.errorResponse(res);
            } else if (users.length == 0) {
                return helper.errorResponse(res, 'Rooms not found', 404);
            }

            return helper.successResponse(res, users);
        });
};
