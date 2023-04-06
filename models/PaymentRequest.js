const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  redeemedList: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "cashback",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("paymentRequest", PaymentRequestSchema);
