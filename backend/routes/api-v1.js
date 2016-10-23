module.exports = function (express) {
    var api = express.Router();

    api.get('/polls', function (req, res) {
        res.send({ message: 'polls list' });
    });


    return api;
};
