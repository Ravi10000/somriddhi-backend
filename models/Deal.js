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
    cashbackPercent:{
        type: double,
        required: true
    },
    url:{
        type:String,
        required: true
    },
    categoryId:{
        type: mongoose.Schema.type.ObjectId,
        required: true
    },
    liveDate:{
        type:Date,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
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
const Deal = mongoose.model('deal', DealSchema);
module.exports = Deal;

//create deal
//update deal
//get all deal ?  categoryId=
//get current deals ? categoryId= (only fetch deals that are live, now() > liveDate && now() < expiryDate)
//delete deal
