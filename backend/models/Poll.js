var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
        },
        correctAnswer: {
            type: Number
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

module.exports = mongoose.model('Poll', PollSchema);
