const Result = require('../models/Result');
const helper = require('./helperController');

const select = 'poll results createdAt';
const sort = '-createdAt';

exports.list = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    Result.paginate({creator: req.user._id}, {select, page, limit, sort, populate: {path: 'poll', select: 'title'}})
        .then(response => {
            let {docs, total, limit, page, pages} = response;
            return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
        })
        .catch(_ => helper.errorResponse(res));
};

exports.read = (req, res) => {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .select(select)
        .populate('poll', 'title')
        .exec()
        .then((result) => {
            if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }
            return helper.successResponse(res, result);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = (req, res) => {
    const newResult = new Result(req.body);
    newResult.creator = req.user._id;

    newResult.save()
        .then((createdResult) => {
            return helper.successResponse(res, createdResult, null, 201);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and results array', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = (req, res) => {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then((result) => {
            if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }
            return result.remove();
        })
        .then(_ => helper.successResponse(res))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
