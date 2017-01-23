const Poll = require('../models/Poll');
const helper = require('./helperController');

const selectFields = 'title description category questions active createdAt updatedAt';
const sortField = 'title';

exports.list = function (req, res) {
    Poll.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .populate('category', 'title')
        .exec()
        .then(function (polls) {
            if (polls.length == 0) {
                return helper.errorResponse(res, 'Polls not found', 404);
            }
            return helper.successResponse(res, polls);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.read = function (req, res) {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .populate('category', 'title')
        .exec()
        .then(function (poll) {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }
            return helper.successResponse(res, poll);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.readActive = function (req, res) {
    Poll.findOne({active: true, creator: req.query.room})
        .select(selectFields)
        .exec()
        .then(function (poll) {
            if (!poll) {
                return helper.errorResponse(res, 'No active polls', 404);
            }
            return helper.successResponse(res, poll);
        })
        .catch(function () {
            return helper.errorResponse(res);
        });
};

exports.create = function (req, res) {
    const newPoll = new Poll(req.body);
    newPoll.creator = req.user._id;

    newPoll.save()
        .then(function (createdPoll) {
            return helper.successResponse(res, createdPoll, 201);
        })
        .catch(function (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and not empty questions array with not empty choices array', 400);
            }
            return helper.errorResponse(res);
        });
};

exports.update = function (req, res) {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then(function (poll) {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }

            poll.title = req.body.title;
            poll.description = req.body.description;
            poll.category = req.body.category;
            poll.questions = req.body.questions;
            poll.active = req.body.active;

            poll.save()
                .then(function (updatedPoll) {
                    return helper.successResponse(res, updatedPoll);
                })
                .catch(function (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title, questions, and active parameters', 400);
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
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec()
        .then(function (poll) {
            if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }
            return poll.remove();
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
