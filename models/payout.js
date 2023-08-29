const mongoose = require("mongoose");
const { Schema } = mongoose;

const payoutSchema = new Schema({
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("payout", payoutSchema);
