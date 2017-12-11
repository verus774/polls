const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');
const config = require('./config');

module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = config.secretKey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload._id})
            .select('name username role')
            .exec((err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
    }));
};
