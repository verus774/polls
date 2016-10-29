var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ValidationError = mongoose.Error.ValidationError;

var PollSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: [{
        text: {
            type: String,
            required: true
        },
        choices: {
            type: [String],
            required: true
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
});

PollSchema.path('questions').validate(function(questions) {
    return (questions && questions.length !== 0);

}, 'Questions array needs to have at least one element');

PollSchema.pre('findOne', function(next) {
    var id = this._conditions._id;
    if(id && !mongoose.Types.ObjectId.isValid(id)) {
        var error = new ValidationError();
        return next(error);
    }
    next();
});

module.exports = mongoose.model('Poll', PollSchema);
