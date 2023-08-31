const mongoose = require("mongoose");
const { Schema } = mongoose;

const cashbackSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid", "Requested"],
    default: "Unpaid",
  },
  // isRedemeed: {
  //   type: Boolean,
  //   default: false,
  // },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cashback = mongoose.model("cashback", cashbackSchema);
module.exports = Cashback;
