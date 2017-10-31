const Poll = require('../models/Poll');
const helper = require('./helperController');

const select = 'title description category questions active createdAt updatedAt';
const sort = 'title';

exports.list = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    Poll.paginate({creator: req.user._id}, {select, page, limit, sort, populate: {path: 'category', select: 'title'}})
        .then(response => {
            let {docs, total, limit, page, pages} = response;
            return helper.successResponse(res, docs, {paging: {total, limit, page, pages}});
        })
        .catch(_ => helper.errorResponse(res));
};

exports.read = (req, res) => {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .select(select)
        .populate('category', 'title')
        .exec()
        .then((poll) => {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }
            return helper.successResponse(res, poll);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.readActive = (req, res) => {
    Poll.findOne({active: true, creator: req.query.room})
        .select(select)
        .exec()
        .then((poll) => {
            if (!poll) {
                return helper.errorResponse(res, 'No active polls', 404);
            }
            return helper.successResponse(res, poll);
        })
        .catch(_ => helper.errorResponse(res));
};

exports.create = (req, res) => {
    const newPoll = new Poll(req.body);
    newPoll.creator = req.user._id;

    newPoll.save()
        .then((createdPoll) => {
            return helper.successResponse(res, createdPoll, null, 201);
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and not empty questions array with not empty choices array', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = (req, res) => {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then((poll) => {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }

            poll.title = req.body.title;
            poll.description = req.body.description;
            poll.category = req.body.category;
            poll.questions = req.body.questions;
            poll.active = req.body.active;

            poll.save()
                .then((updatedPoll) => {
                    return helper.successResponse(res, updatedPoll);
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title, questions, and active parameters', 400);
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
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then((poll) => {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }
            return poll.remove();
        })
        .then(_ => helper.successResponse(res))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};
