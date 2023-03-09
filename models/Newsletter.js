const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsletterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
const Newsletter = mongoose.model('newsletter', NewsletterSchema);
module.exports = Newsletter;

//create newsletter
//get all newsletters ?  status= (Optional field status)
//delete newsletter
