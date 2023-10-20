const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discountedAmount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    firstname: String,
    lastname: String,
    // salutation: String,
    line1: String,
    line2: String,
    // city: String,
    district: String,
    // region: String,
    state: String,
    postcode: String,
    yesPayResponse: String,
    phonePeResponse: String,
    status: {
      type: String,
      enum: ["initiated", "paid", "failed", "pending"],
      default: "initiated",
    },
    method: {
      type: String,
      enum: ["phonepe", "yespay"],
      default: "yespay",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
