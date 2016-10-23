var User = require('../models/User');
var jsonWebToken = require('jsonwebtoken');
var config = require('../config');


function createToken(user) {
    return jsonWebToken.sign({
            _id: user._id,
            name: user.name,
            username: user.username
        }, config.secretKey,
        { expiresIn: config.tockenExpiresIn }
    );
}

module.exports = function (express) {
    var api = express.Router();

    api.post('/signup', function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please pass username and password'
            });
        }

        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        newUser.save(function(err, createdUser) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Server error'
                });
            }

            var token = createToken(createdUser);

            return res.status(201).json({
                status: 'success',
                data: { token: token }
            });
        });

    });

    api.post('/login', function (req, res) {

        if (!req.body.username || !req.body.password) {
            return res.status(401).json({
                status: 'error',
                message: 'Empty username or password'
            });
        }

        User.findOne({ username: req.body.username }, function(err, user) {
            if (!user || !user.comparePasswords(req.body.password)) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid username or password'
                });
            } else {
                var token = createToken(user);

                return res.json({
                    status: 'success',
                    data: { token: token }
                });
            }
        });

    });


    return api;
};
