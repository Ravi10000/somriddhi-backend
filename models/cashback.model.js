const mongoose = require("mongoose");
const { Schema } = mongoose;

const cashbackSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRedemeed: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Cashback = mongoose.model("cashback", cashbackSchema);
module.exports = Cashback;
