const Result = require('../models/Result');
const helper = require('./helperController');

const selectFields = 'poll results createdAt';
const sortField = '-createdAt';

exports.list = (req, res) => {
    Result.find({creator: req.user._id})
        .select(selectFields)
        .populate('poll', 'title')
        .sort(sortField)
        .exec()
        .then((results) => {
            if (results.length === 0) {
                return helper.errorResponse(res, 'Results not found', 404);
            }
            return helper.successResponse(res, results);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = (req, res) => {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
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
            return helper.successResponse(res, createdResult, 201);
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
        .then(function () {
            return helper.successResponse(res);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
