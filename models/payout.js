const mongoose = require("mongoose");
const { Schema } = mongoose;

const payoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  transactionId: {
    type: String,
    required: true,
  },
  walletId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
  },
});

module.exports = mongoose.model("payout", payoutSchema);
