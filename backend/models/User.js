const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const {promisify} = require('util');
const {sign} = require('jsonwebtoken');
const signToken = promisify(sign);
const config = require('../config');
const mongoosePaginate = require('mongoose-paginate');
const Poll = require('./Poll');
const Result = require('./Result');

const UserSchema = new Schema({
        name: {
            type: String,
            minlength: 4,
            maxlength: 100,
            required: true,
            trim: true
        },
        username: {
            type: String,
            minlength: 4,
            maxlength: 20,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minlength: 3,
            maxlength: 100,
            match: /^[ A-Za-z0-9_@./#&+-]*$/,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        token: {
            type: String
        }
    }, {timestamps: true}
);

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(user.password, salt)
                .then((hash) => {
                    user.password = hash;
                    return next();
                });
        })
        .catch((err) => {
            return next(err);
        });

});

UserSchema.pre('remove', function (next) {
    Poll.remove({creator: this._id}).exec();
    Result.remove({creator: this._id}).exec();
    next();
});

UserSchema.methods.comparePasswords = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.createAccessToken = function () {
    const payload = {
        _id: this._id,
        name: this.name,
        username: this.username,
        role: this.role
    };
    return signToken(payload, config.accessTokenSecretKey, {expiresIn: config.accessTokenExpiresIn})
        .then(token => 'JWT ' + token);
};

UserSchema.methods.createRefreshToken = function () {
    const payload = {_id: this._id};
    return signToken(payload, config.refreshTokenSecretKey, {expiresIn: config.refreshTokenExpiresIn})
        .then(token => {
            return this.model('User').findOneAndUpdate({_id: this._id}, {$set: {token}}).exec()
                .then(() => 'JWT ' + token);
        });
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
