var polls = require('../controllers/pollsController');

module.exports = function (express, passport) {
    var api = express.Router();

    api.use('/polls', passport.authenticate('jwt', {session: false}));

    api.route('/polls')
        .get(polls.list)
        .post(polls.create);

    api.route('/polls/:id')
        .get(polls.read)
        .delete(polls.delete)
        .put(polls.update);

    return api;
};
