var Poll = require('../models/Poll');
var helper = require('./helperController');

var selectFields = 'title description category questions active createdAt updatedAt';
var sortField = 'title';

exports.list = function (req, res) {
    Poll.find({creator: req.user._id})
        .select(selectFields)
        .sort(sortField)
        .populate('category', 'title')
        .exec(function (err, polls) {
            if (err) {
                return helper.errorResponse(res);
            } else if (polls.length == 0) {
                return helper.errorResponse(res, 'Polls not found', 404);
            }

            return helper.successResponse(res, polls);
        });
};

exports.read = function (req, res) {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .select(selectFields)
        .populate('category', 'title')
        .exec(function (err, poll) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }

            return helper.successResponse(res, poll);
        });
};

exports.readActive = function (req, res) {
    Poll.findOne({active: true, creator: req.query.room})
        .select(selectFields)
        .exec(function (err, poll) {
            if (err) {
                return helper.errorResponse(res);
            } else if (!poll) {
                return helper.errorResponse(res, 'No active polls', 404);
            }

            return helper.successResponse(res, poll);
        });
};

exports.create = function (req, res) {
    var newPoll = new Poll(req.body);
    newPoll.creator = req.user._id;

    newPoll.save(function (err, createdPoll) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Must provide title and not empty questions array with not empty choices array', 400);
            }
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, createdPoll, 201);
    });
};

exports.update = function (req, res) {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec(function (err, poll) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }

            poll.title = req.body.title;
            poll.description = req.body.description;
            poll.category = req.body.category;
            poll.questions = req.body.questions;
            poll.active = req.body.active;

            poll.save(function (err, updatedPoll) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        return helper.errorResponse(res, 'Must provide title, questions, and active parameters', 400);
                    }
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res, updatedPoll);
            });
        });
};

exports.delete = function (req, res) {
    Poll.findOne({creator: req.user._id, _id: req.params.id})
        .exec(function (err, poll) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Invalid id parameter', 400);
                }
                return helper.errorResponse(res);
            } else if (!poll) {
                return helper.errorResponse(res, 'Poll not found', 404);
            }

            poll.remove(function (err) {
                if (err) {
                    return helper.errorResponse(res);
                }
                return helper.successResponse(res);
            });
        });
};
