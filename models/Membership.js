const mongoose = require("mongoose");
const { Schema } = mongoose;

const MembershipSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  cashbackPercent: {
    type: Number,
    required: false,
  },
  maxCashback: {
    type: Number,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: Date.now,
  },
});
const Membership = mongoose.model("Membership", MembershipSchema);
module.exports = Membership;

//create membership
//update membersip
//get all memberships ?  status= (Optional field status)
//delete membership
