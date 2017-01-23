const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ValidationError = mongoose.Error.ValidationError;
const Result = require('./Result');

const PollSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category',
        required: true
    },
    questions: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        choices: {
            type: [String],
            required: true,
            trim: true
        }
    }],
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    }
}, {timestamps: true});

PollSchema.index({title: 1, creator: 1}, {unique: true});

PollSchema.path('questions').validate(function(questions) {
    return (questions && questions.length !== 0);

}, 'Questions array needs to have at least one element');

PollSchema.pre('findOne', function(next) {
    const id = this._conditions._id;
    if(id && !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ValidationError());
    }
    next();
});

PollSchema.pre('remove', function (next) {
    Result.remove({poll: this._id}).exec();
    next();
});

module.exports = mongoose.model('Poll', PollSchema);
