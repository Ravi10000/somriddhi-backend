const mongoose = require('mongoose');
const { Schema } = mongoose;

const BannerSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: false
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
const Banner = mongoose.model('banner', BannerSchema);
module.exports = Banner;

//create banner
//update banner
//get all banners
//delete banner
