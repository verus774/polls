const users = require('../controllers/usersController');

module.exports = (express, passport) => {
    const api = express.Router();

    api.post('/signup', users.signup);
    api.post('/login', users.login);

    return api;
};
