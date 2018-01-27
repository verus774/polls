const Category = require('../models/Category');
const helper = require('./helperController');

const select = 'title description';
const sort = 'title';

exports.list = async (req, res) => {
    const pageDefault = parseInt(req.query.page, 10) || 1;
    const limitDefault = parseInt(req.query.limit, 10) || 50;

    try {
        const response = await Category.paginate({creator: req.user._id}, {select, sort, page: pageDefault, limit: limitDefault});
        const {docs, total, limit, page, pages} = response;
        return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
    } catch (err) {
        return helper.errorResponse(res);
    }
};

exports.read = async (req, res) => {
    try {
        const category = await Category.findOne({creator: req.user._id, _id: req.params.id}).select(select).exec();
        if (!category) {
            return helper.errorResponse(res, 'Category not found', 404);
        }
        return helper.successResponse(res, category);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.create = async (req, res) => {
    const newCategory = new Category(req.body);
    newCategory.creator = req.user._id;

    try {
        const createdCategory = await newCategory.save();
        return helper.successResponse(res, createdCategory, null, 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Must provide title', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.update = async (req, res) => {
    try {
        const category = await Category.findOne({creator: req.user._id, _id: req.params.id}).exec();
        if (!category) {
            return helper.errorResponse(res, 'Category not found', 404);
        }

        category.title = req.body.title;
        category.description = req.body.description;

        try {
            const updatedCategory = await category.save();
            return helper.successResponse(res, updatedCategory);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title', 400);
            }
            return helper.errorResponse(res);
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.delete = async (req, res) => {
    try {
        const category = await Category.findOne({creator: req.user._id, _id: req.params.id}).exec();
        if (!category) {
            return helper.errorResponse(res, 'Category not found', 404);
        }
        await category.remove();
        return helper.successResponse(res);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};
