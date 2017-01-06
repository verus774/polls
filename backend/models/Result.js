var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationError = mongoose.Error.ValidationError;

var ResultSchema = new Schema({
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
    var id = this._conditions._id;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        var error = new ValidationError();
        return next(error);
    }
    next();
});

module.exports = mongoose.model('Result', ResultSchema);
