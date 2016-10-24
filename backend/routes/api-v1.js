var Poll = require('../models/Poll');

module.exports = function (express, passport) {
    var api = express.Router();

    api.use('/polls', passport.authenticate('jwt', { session: false}));

    api.route('/polls')
        .get(function (req, res) {
            Poll.find({ creator: req.user._id }, function (err, polls) {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Server error'
                    });
                }

                return res.json({
                    status: 'success',
                    data: polls
                });
            });
        })
        .post(function (req, res) {
            if (!req.body.title || !req.body.questions) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Must provide a title and questions array'
                });
            }

            var newPoll = new Poll({
                title: req.body.title,
                questions: req.body.questions,
                creator: req.user._id
            });

            newPoll.save(function(err, createdPoll) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: 'error',
                        message: 'Server error'
                    });
                }

                return res.status(201).json({
                    status: 'success',
                    data: createdPoll
                });
            });

        });

    // TODO: check id
    api.route('/polls/:id')
        .get(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'Server error'
                    });
                }

                return res.json({
                    status: 'success',
                    data: poll
                });
            });
        })
        .delete(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function(err, poll) {
                poll.remove(function(err) {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: 'Server error'
                        });
                    }

                    return res.json({
                        status: 'success',
                        data: null
                    });
                });
            });
        })
        .put(function (req, res) {
            Poll.findOne({ _id: req.params.id, creator: req.user._id }, function (err, poll) {
                poll.title = req.body.title;
                poll.questions = req.body.questions;

                poll.save(function (err, poll) {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: 'Server error'
                        });
                    }

                    return res.json({
                        status: 'success',
                        data: poll
                    });
                });
            });

        });


    return api;
};
