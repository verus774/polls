const User = require('../models/User');
const helper = require('./helperController');

const select = 'name';
const sort = 'name';

exports.list = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    User.paginate({}, {select, page, limit, sort})
        .then(response => {
            let {docs, total, limit, page, pages} = response;
            return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
        })
        .catch(_ => helper.errorResponse(res));
};

exports.read = (req, res) => {
    User.findOne({_id: req.params.id})
        .select(select)
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
