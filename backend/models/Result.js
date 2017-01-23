const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidationError = mongoose.Error.ValidationError;

const ResultSchema = new Schema({
    poll: {
        type: Schema.Types.ObjectId, ref: 'Poll',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    results: [{
        questionText: {
            type: String,
            required: true
        },
        questionId: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        _id: false
    }],
    creator: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    }
}, {timestamps: true});

ResultSchema.path('results').validate(function (results) {
    return (results && results.length !== 0);

}, 'Results array needs to have at least one element');

ResultSchema.pre('findOne', function (next) {
    const id = this._conditions._id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ValidationError());
    }
    next();
});

module.exports = mongoose.model('Result', ResultSchema);
