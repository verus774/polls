var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Poll = require('./Poll');
var Result = require('./Result');

var UserSchema = new Schema({
        name: {
            type: String,
            minlength: 4,
            maxlength: 100,
            match: /^[a-z0-9_-]*$/,
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
        }
    }, {timestamps: true}
);

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });

});

UserSchema.pre('remove', function (next) {
    Poll.remove({creator: this._id}).exec();
    Result.remove({creator: this._id}).exec();
    next();
});

UserSchema.methods.comparePasswords = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
