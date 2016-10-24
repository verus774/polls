var Poll = require('../models/Poll');
var mongoose = require('mongoose');

function isObjectId(objId) {
    return mongoose.Types.ObjectId.isValid(objId);
}

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

    api.use('/polls', passport.authenticate('jwt', { session: false}));

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
            if (!(req.body.title || req.body.questions)) {
                return errorResponse(res, 'Must provide title and questions array', 400);
            }

            var newPoll = new Poll({
                title: req.body.title,
                questions: req.body.questions,
                creator: req.user._id
            });

            newPoll.save(function(err, createdPoll) {
                if (err) {
                    return errorResponse(res);
                }

                return successResponse(res, createdPoll, 201);
            });

        });

    api.route('/polls/:id')
        .get(function (req, res) {
            if (!isObjectId(req.params.id)) {
                return errorResponse(res, 'Invalid id parameter', 400);
            }

            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                if (err) {
                    return errorResponse(res);
                }

                return successResponse(res, poll);
            });
        })
        .delete(function (req, res) {
            if (!isObjectId(req.params.id)) {
                return errorResponse(res, 'Invalid id parameter', 400);
            }

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
            if (!isObjectId(req.params.id)) {
                return errorResponse(res, 'Invalid id parameter', 400);
            }

            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                poll.title = req.body.title;
                poll.questions = req.body.questions;

                poll.save(function (err, poll) {
                    if (err) {
                        return errorResponse(res);
                    }
                    return successResponse(res, poll);
                });
            });

        });


    return api;
};
