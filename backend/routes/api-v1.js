var polls = require('../controllers/pollsController');
var categories = require('../controllers/categoriesController');
var users = require('../controllers/usersController');
var rooms = require('../controllers/roomsController');
var results = require('../controllers/resultsController');
var helper = require('../controllers/helperController');

function requireRole(role) {
    return function (req, res, next) {
        if (req.user.role === role)
            next();
        else {
            return helper.errorResponse(res, 'Forbidden', 403);
        }
    }
}

module.exports = function (express, passport) {
    var api = express.Router();

    api.route('/active-poll')
        .get(polls.readActive);

    api.use('/polls', passport.authenticate('jwt', {session: false}));
    api.route('/polls')
        .get(polls.list)
        .post(polls.create);
    api.route('/polls/:id')
        .get(polls.read)
        .delete(polls.delete)
        .put(polls.update);

    api.use('/categories', passport.authenticate('jwt', {session: false}));
    api.route('/categories')
        .get(categories.list)
        .post(categories.create);
    api.route('/categories/:id')
        .get(categories.read)
        .delete(categories.delete)
        .put(categories.update);

    api.use('/results', passport.authenticate('jwt', {session: false}));
    api.route('/results')
        .get(results.list)
        .post(results.create);
    api.route('/results/:id')
        .get(results.read)
        .delete(results.delete);

    api.use('/users', passport.authenticate('jwt', {session: false}));
    api.route('/users')
        .get(requireRole('admin'), users.list)
        .post(requireRole('admin'), users.create);
    api.route('/users/:id')
        .get(requireRole('admin'), users.read)
        .delete(requireRole('admin'), users.delete)
        .put(requireRole('admin'), users.update);

    api.route('/rooms')
        .get(rooms.list);

    return api;
};
