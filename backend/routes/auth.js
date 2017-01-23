const users = require('../controllers/usersController');

module.exports = (express, passport) => {
    const api = express.Router();

    api.post('/signup', users.signup);
    api.post('/login', users.login);

    api.use('/me', passport.authenticate('jwt', {session: false}));
    api.route('/me')
        .get(users.me)
        .put(users.updateMe);

    return api;
};
