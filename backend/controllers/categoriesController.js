var Category = require('../models/Category');
var helper = require('./helperController');

var selectFields = 'title description';
var sortField = 'title';

exports.list = function (req, res) {
    Category.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .exec()
        .then(function (categories) {
            if (categories.length == 0) {
                return helper.errorResponse(res, 'Categories not found', 404);
            }
            return helper.successResponse(res, categories);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .exec()
        .then(function (category) {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }
            return helper.successResponse(res, category);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = function (req, res) {
    var newCategory = new Category(req.body);
    newCategory.creator = req.user._id;

    newCategory.save()
        .then(function (createdCategory) {
            return helper.successResponse(res, createdCategory, 201);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then(function (category) {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }

            category.title = req.body.title;
            category.description = req.body.description;

            category.save()
                .then(function (updatedCategory) {
                    return helper.successResponse(res, updatedCategory);
                })
                .catch(function (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then(function (category) {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }
            return category.remove();
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
