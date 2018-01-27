const Result = require('../models/Result');
const helper = require('./helperController');

const select = 'poll results createdAt';
const sort = '-createdAt';

exports.list = async (req, res) => {
    const pageDefault = parseInt(req.query.page, 10) || 1;
    const limitDefault = parseInt(req.query.limit, 10) || 50;

    try {
        const response = await Result.paginate({creator: req.user._id},
            {select, sort,
                populate: {path: 'poll', select: 'title'},
                page: pageDefault, limit: limitDefault});
        const {docs, total, limit, page, pages} = response;
        return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
    } catch (err) {
        return helper.errorResponse(res);
    }

};

exports.read = async (req, res) => {
    try {
        const result = await Result.findOne({creator: req.user._id, _id: req.params.id}).select(select).populate('poll', 'title').exec();
        if (!result) {
            return helper.errorResponse(res, 'Result not found', 404);
        }
        return helper.successResponse(res, result);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.create = async (req, res) => {
    const newResult = new Result(req.body);
    newResult.creator = req.user._id;

    try {
        const createdResult = await newResult.save();
        return helper.successResponse(res, createdResult, null, 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Must provide title and results array', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Result.findOne({creator: req.user._id, _id: req.params.id}).exec();
        if (!result) {
            return helper.errorResponse(res, 'Result not found', 404);
        }
        await result.remove();
        return helper.successResponse(res);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};
