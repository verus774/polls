var Category = require('../models/Category');
var helper = require('./helperController');

var selectFields = 'title description';
var sortField = 'title';

exports.list = function (req, res) {
    Category.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .exec(function (err, categories) {
            if (err) {
                return helper.errorResponse(res);
            } else if (categories.length == 0) {
                return helper.errorResponse(res, 'Categories not found', 404);
            }

            return helper.successResponse(res, categories);
        });
};

exports.read = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .exec(function (err, category) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }

            return helper.successResponse(res, category);
        });
};

exports.create = function (req, res) {
    var newCategory = new Category(req.body);
    newCategory.creator = req.user._id;

    newCategory.save(function (err, createdCategory) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title', 400);
            }
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, createdCategory, 201);
    });
};

exports.update = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec(function (err, category) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }

            category.title = req.body.title;
            category.description = req.body.description;

            category.save(function (err, updatedCategory) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title', 400);
                    }
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res, updatedCategory);
            });
        });
};

exports.delete = function (req, res) {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec(function (err, category) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }

            category.remove(function (err) {
                if (err) {
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res);
            });
        });
};
