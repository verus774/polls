const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidationError = mongoose.Error.ValidationError;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
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

CategorySchema.index({title: 1, creator: 1}, {unique: true});

CategorySchema.pre('findOne', function (next) {
    const id = this._conditions._id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ValidationError());
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
