const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');

module.exports = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = config.accessTokenSecretKey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        const expirationDate = new Date(jwt_payload.exp * 1000);
        if (expirationDate < new Date()) {
            return done(null, false);
        }
        done(null, jwt_payload);
    }));
};
