var User = require('../models/User');
var helper = require('./helperController');

var selectFields = 'name';
var sortField = 'name';

exports.list = function (req, res) {
    var page = parseInt(req.query.page),
        size = parseInt(req.query.size),
        skip = page > 0 ? ((page - 1) * size) : 0;

    User.find({})
        .select(selectFields)
        .skip(skip)
        .limit(size)
        .sort(sortField)
        .exec(function (err, users) {
            if (err) {
                return helper.errorResponse(res);
            } else if (users.length == 0) {
                return helper.errorResponse(res, 'Rooms not found', 404);
            }

            return helper.successResponse(res, users);
        });
};
