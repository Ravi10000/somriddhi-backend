const mongoose = require('mongoose');
const { Schema } = mongoose;

const MembershipSchema = new Schema({
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
    staus:{
        type:String,
        enum:['Active','Inactive']
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
const Membership = mongoose.model('Membership', MembershipSchema);
module.exports = Membership;

//create membership
//update membersip
//get all memberships ?  status= (Optional field status)
//delete membership
