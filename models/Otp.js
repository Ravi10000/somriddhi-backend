const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.type.ObjectId,
        default: Date.now
    }
});
const Otp = mongoose.model('otp', OtpSchema);
module.exports = Otp;


