const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
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
    return new Promise((resolve, reject) => {
        jsonWebToken.sign({
                _id: this._id,
                name: this.name,
                username: this.username,
                role: this.role
            },
            config.accessTokenSecretKey,
            {expiresIn: config.accessTokenExpiresIn},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve('JWT ' + token);
            }
        );
    });
};

UserSchema.methods.createRefreshToken = function () {
    return new Promise((resolve, reject) => {
        jsonWebToken.sign({_id: this._id},
            config.refreshTokenSecretKey,
            {expiresIn: config.refreshTokenExpiresIn},
            (err, token) => {
                if (err) {
                    return reject(err);
                }
                this.token = token;
                this.model('User').findOneAndUpdate({_id: this._id}, {$set: {token}})
                    .exec()
                    .then(() => resolve('JWT ' + token));
            }
        );
    });
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
