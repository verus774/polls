const User = require('../models/User');
const helper = require('./helperController');

const select = 'name';
const sort = 'name';

exports.list = async (req, res) => {
    const pageDefault = parseInt(req.query.page, 10) || 1;
    const limitDefault = parseInt(req.query.limit, 10) || 50;

    try {
        const response = await User.paginate({}, {select, sort, page: pageDefault, limit: limitDefault});
        const {docs, total, limit, page, pages} = response;
        return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
    } catch (err) {
        return helper.errorResponse(res);
    }
};

exports.read = async (req, res) => {
    try {
        const room = await User.findOne({_id: req.params.id}).select(select).exec();
        if (!room) {
            return helper.errorResponse(res, 'Room not found', 404);
        }
        return helper.successResponse(res, room);
    } catch (err) {
        return helper.errorResponse(res);
    }
};
