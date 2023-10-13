const mongoose = require("mongoose");
const { Schema } = mongoose;

const GiftCardSchema = new Schema({
  refno: {
    type: String,
    required: true,
  },
  requestBody: {
    type: String,
    required: true,
  },
  activatedCardRes: {
    type: String,
  },
  totalAmount: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: String,
    required: true,
  },
  qty: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PROCESSING", "COMPLETE"],
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
const GiftCard = mongoose.model("GiftCard", GiftCardSchema);
module.exports = GiftCard;
