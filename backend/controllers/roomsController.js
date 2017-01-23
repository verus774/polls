const User = require('../models/User');
const helper = require('./helperController');

const selectFields = 'name';
const sortField = 'name';

exports.list = function (req, res) {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const skip = page > 0 ? ((page - 1) * size) : 0;

    User.find({})
        .select(selectFields)
        .skip(skip)
        .limit(size)
        .sort(sortField)
        .exec()
        .then(function (users) {
            if (users.length == 0) {
                return helper.errorResponse(res, 'Rooms not found', 404);
            }
            return helper.successResponse(res, users);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};
