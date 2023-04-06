const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  trackingId: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
  },
  itemsOrdered: {
    type: Number,
    required: true,
  },
  itemsShipped: {
    type: Number,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  addFees: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
  },
});
const Payment = mongoose.model("payment", PaymentSchema);
module.exports = Payment;
