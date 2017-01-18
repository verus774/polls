var Result = require('../models/Result');
var helper = require('./helperController');

var selectFields = 'title results createdAt';
var sortField = '-createdAt';

exports.list = function (req, res) {
    Result.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .exec()
        .then(function (results) {
            if (results.length == 0) {
                return helper.errorResponse(res, 'Results not found', 404);
            }
            return helper.successResponse(res, results);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = function (req, res) {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .exec()
        .then(function (result) {
            if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }
            return helper.successResponse(res, result);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = function (req, res) {
    var newResult = new Result(req.body);
    newResult.creator = req.user._id;

    newResult.save()
        .then(function (createdResult) {
            return helper.successResponse(res, createdResult, 201);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and results array', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = function (req, res) {
    Result.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then(function (result) {
            if (!result) {
                return helper.errorResponse(res, 'Result not found', 404);
            }
            return result.remove();
        })
        .then(function () {
            return helper.successResponse(res);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
