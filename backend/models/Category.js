var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationError = mongoose.Error.ValidationError;

var CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 100
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    }
});

CategorySchema.pre('findOne', function (next) {
    var id = this._conditions._id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        var error = new ValidationError();
        return next(error);
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
