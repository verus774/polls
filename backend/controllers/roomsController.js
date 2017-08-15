const User = require('../models/User');
const helper = require('./helperController');

const selectFields = 'name';
const sortField = 'name';

exports.list = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const skip = page > 0 ? ((page - 1) * size) : 0;

    User.find({})
        .select(selectFields)
        .skip(skip)
        .limit(size)
        .sort(sortField)
        .exec()
        .then((users) => {
            if (users.length === 0) {
                return helper.errorResponse(res, 'Rooms not found', 404);
            }
            return helper.successResponse(res, users);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = (req, res) => {
    User.findOne({_id: req.params.id})
        .select(selectFields)
        .exec()
        .then((room) => {
            if (!room) {
                return helper.errorResponse(res, 'Room not found', 404);
            }
            return helper.successResponse(res, room);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
