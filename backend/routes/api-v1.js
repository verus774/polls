var polls = require('../controllers/pollsController');
var users = require('../controllers/usersController');
var helper = require('../controllers/helperController');

function requireRole(role) {
    return function(req, res, next) {
        if(req.user.role === role)
            next();
        else{
            return helper.errorResponse(res, 'Forbidden', 403);
        }
    }
}

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

    api.use('/users', passport.authenticate('jwt', {session: false}));
    api.route('/users')
        .get(requireRole('admin'), users.list);
    api.route('/users/me')
        .get(users.me);

    return api;
};
