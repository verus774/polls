var Poll = require('../models/Poll');

function errorResponse(res, message, code) {
    return res.status(code || 500).json({
        status: 'error',
        message: message || 'Server error'
    });
}

function successResponse(res, data, code) {
    return res.status(code || 200).json({
        status: 'success',
        data: data || null
    });
}


module.exports = function (express, passport) {
    var api = express.Router();

    api.use('/polls', passport.authenticate('jwt', { session: false }));
    api.route('/polls')
        .get(function (req, res) {
            Poll.find({ creator: req.user._id }, function (err, polls) {
                if (err) {
                    return errorResponse(res);
                }

                return successResponse(res, polls);
            });
        })
        .post(function (req, res) {
            var newPoll = new Poll({
                title: req.body.title,
                description: req.body.description,
                questions: req.body.questions,
                active: req.body.active,
                creator: req.user._id
            });

            newPoll.save(function(err, createdPoll) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        return errorResponse(res, 'Must provide title and not empty questions array with not empty choices array', 400);
                    }
                    return errorResponse(res);
                }

                return successResponse(res, createdPoll, 201);
            });

        });

    api.route('/polls/:id')
        .get(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        return errorResponse(res, 'Invalid id parameter', 400);
                    }
                    return errorResponse(res);
                }

                return successResponse(res, poll);
            });
        })
        .delete(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function(err, poll) {
                poll.remove(function(err) {
                    if (err) {
                        return errorResponse(res);
                    }
                    return successResponse(res);
                });
            });
        })
        .put(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        return errorResponse(res, 'Invalid id parameter', 400);
                    }
                    return errorResponse(res);
                }

                poll.title = req.body.title;
                poll.description = req.body.description;
                poll.questions = req.body.questions;
                poll.active = req.body.active;

                poll.save(function (err, poll) {
                    if (err) {
                        if (err.name == 'ValidationError') {
                            return errorResponse(res, 'Must provide title, questions, and active parameters', 400);
                        }
                        return errorResponse(res);
                    }
                    return successResponse(res, poll);
                });
            });

        });

    return api;
};
