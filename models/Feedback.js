const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    starRating: {
        type: Number,
        required: false
    },
    feedbackText: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: Date.now
    }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;

//create feedback
//get all feedbacks (optional field status)
//delete feedback
