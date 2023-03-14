const mongoose = require('mongoose');
const { Schema } = mongoose;

const DealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    cashbackPercent: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    liveDate: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
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
const Deal = mongoose.model('deal', DealSchema);
module.exports = Deal;

//create deal
//update deal
//get all deal ?  categoryId=
//get current deals ? categoryId= (only fetch deals that are live, now() > liveDate && now() < expiryDate)
//delete deal
