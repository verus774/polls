const Poll = require('../models/Poll');
const helper = require('./helperController');

const select = 'title description category questions active createdAt updatedAt';
const sort = 'title';

exports.list = async (req, res) => {
    const pageDefault = parseInt(req.query.page, 10) || 1;
    const limitDefault = parseInt(req.query.limit, 10) || 50;

    const query = {};
    if (req.user._id) query.creator = req.user._id;
    if (req.query.category) query.category = req.query.category;

    try {
        const response = await Poll.paginate(query, {
            select,
            sort,
            populate: {path: 'category', select: 'title'},
            page: pageDefault,
            limit: limitDefault
        });
        const {docs, total, limit, page, pages} = response;
        return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.read = async (req, res) => {
    try {
        const poll = await Poll.findOne({
            creator: req.user._id,
            _id: req.params.id
        }).select(select).populate('category', 'title').exec();
        if (!poll) {
            return helper.errorResponse(res, 'Poll not found', 404);
        }

        return helper.successResponse(res, poll);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.readActive = async (req, res) => {
    try {
        const poll = await Poll.findOne({active: true, creator: req.query.room}).select(select).exec();
        if (!poll) {
            return helper.errorResponse(res, 'No active polls', 404);
        }
        return helper.successResponse(res, poll);

    } catch (err) {
        return helper.errorResponse(res);
    }
};

exports.create = async (req, res) => {
    const newPoll = new Poll(req.body);
    newPoll.creator = req.user._id;

    try {
        const createdPoll = await newPoll.save();
        return helper.successResponse(res, createdPoll, null, 201);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Must provide title and not empty questions array with not empty choices array', 400);
        }
        return helper.errorResponse(res);
    }
};

exports.update = async (req, res) => {
    try {
        const poll = await Poll.findOne({creator: req.user._id, _id: req.params.id}).exec();
        if (!poll) {
            return helper.errorResponse(res, 'Poll not found', 404);
        }

        poll.title = req.body.title;
        poll.description = req.body.description;
        poll.category = req.body.category;
        poll.questions = req.body.questions;
        poll.active = req.body.active;

        try {
            const updatedPoll = await poll.save();
            return helper.successResponse(res, updatedPoll);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title, questions, and active parameters', 400);
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
        const poll = await Poll.findOne({creator: req.user._id, _id: req.params.id}).exec();
        if (!poll) {
            return helper.errorResponse(res, 'Poll not found', 404);
        }
        await poll.remove();
        return helper.successResponse(res);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return helper.errorResponse(res, 'Invalid id parameter', 400);
        }
        return helper.errorResponse(res);
    }
};
