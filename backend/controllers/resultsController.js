var Result = require('../models/Result');
var helper = require('./helperController');

var selectFields = 'title results createdAt';
var sortField = '-createdAt';

exports.list = function (req, res) {
    Result.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .exec(function (err, results) {
            if (err) {
                return helper.errorResponse(res);
            } else if (results.length == 0) {
                return helper.errorResponse(res, 'Results not found', 404);
            }

            return helper.successResponse(res, results);
        });
};

exports.read = function (req, res) {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .exec(function (err, result) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }

            return helper.successResponse(res, result);
        });
};

exports.create = function (req, res) {
    var newResult = new Result(req.body);
    newResult.creator = req.user._id;

    newResult.save(function (err, createdResult) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and results array', 400);
            }
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, createdResult, 201);
    });
};

exports.delete = function (req, res) {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .exec(function (err, result) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }

            result.remove(function (err) {
                if (err) {
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res);
            });
        });
};
