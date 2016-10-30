var Poll = require('../models/Poll');
var helper = require('./helperController');


exports.list = function (req, res) {
    Poll.find({creator: req.user._id}, function (err, polls) {
        if (err) {
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, polls);
    });
};

exports.read = function (req, res) {
    Poll.findOne({_id: req.params.id, creator: req.user._id}, function (err, poll) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        }

        return helper.successResponse(res, poll);
    });
};

exports.create = function (req, res) {
    var newPoll = new Poll({
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions,
        active: req.body.active,
        creator: req.user._id
    });

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
    Poll.findOne({_id: req.params.id, creator: req.user._id}, function (err, poll) {
        if (err) {
            if (err.name == 'ValidationError') {
                return helper.errorResponse(res, 'Invalid id parameter', 400);
            }
            return helper.errorResponse(res);
        }

        poll.title = req.body.title;
        poll.description = req.body.description;
        poll.questions = req.body.questions;
        poll.active = req.body.active;

        poll.save(function (err, poll) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return helper.errorResponse(res, 'Must provide title, questions, and active parameters', 400);
                }
                return helper.errorResponse(res);
            }
            return helper.successResponse(res, poll);
        });
    });
};

exports.delete = function (req, res) {
    Poll.findOne({_id: req.params.id, creator: req.user._id}, function (err, poll) {
        poll.remove(function (err) {
            if (err) {
                return helper.errorResponse(res);
            }
            return helper.successResponse(res);
        });
    });
};
