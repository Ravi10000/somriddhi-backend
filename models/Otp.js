const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     default: Date.now
    // }
});
const Otp = mongoose.model('otp', OtpSchema);
module.exports = Otp;


