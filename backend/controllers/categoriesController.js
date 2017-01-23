const Category = require('../models/Category');
const helper = require('./helperController');

const selectFields = 'title description';
const sortField = 'title';

exports.list = (req, res) => {
    Category.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .exec()
        .then((categories) => {
            if (categories.length == 0) {
                return helper.errorResponse(res, 'Categories not found', 404);
            }
            return helper.successResponse(res, categories);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = (req, res) => {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .exec()
        .then((category) => {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }
            return helper.successResponse(res, category);
        })
        .catch((err) => {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.create = (req, res) => {
    const newCategory = new Category(req.body);
    newCategory.creator = req.user._id;

    newCategory.save()
        .then((createdCategory) => {
            return helper.successResponse(res, createdCategory, 201);
        })
        .catch((err) => {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = (req, res) => {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then((category) => {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }

            category.title = req.body.title;
            category.description = req.body.description;

            category.save()
                .then((updatedCategory) => {
                    return helper.successResponse(res, updatedCategory);
                })
                .catch((err) => {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch((err) => {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.delete = (req, res) => {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then((category) => {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }
            return category.remove();
        })
        .then(function () {
            return helper.successResponse(res);
        })
        .catch((err) => {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
