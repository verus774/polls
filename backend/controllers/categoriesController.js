const Category = require('../models/Category');
const helper = require('./helperController');

const select = 'title description';
const sort = 'title';

exports.list = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    Category.paginate({creator: req.user._id}, {select, page, limit, sort})
        .then(response => {
            let {docs, total, limit, page, pages} = response;
            if (docs.length === 0) {
                return helper.errorResponse(res, 'Categories not found', 404);
            }
            return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
        })
        .catch(_ => helper.errorResponse(res));
};

exports.read = (req, res) => {
    Category.findOne({creator: req.user._id, _id: req.params.id})
        .select(select)
        .exec()
        .then((category) => {
            if (!category) {
                return helper.errorResponse(res, 'Category not found', 404);
            }
            return helper.successResponse(res, category);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
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
            return helper.successResponse(res, createdCategory, null, 201);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
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
                    if (err.name === 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title', 400);
                    }
                    return helper.errorResponse(res);
                });
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
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
        .then(_ => helper.successResponse(res))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
