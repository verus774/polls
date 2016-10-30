var users = require('../controllers/usersController');

module.exports = function (express) {
    var api = express.Router();

    api.post('/signup', users.signup);
    api.post('/login', users.login);

    return api;
};
