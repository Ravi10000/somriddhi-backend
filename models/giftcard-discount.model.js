const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    discountPercentage: {
      type: Number,
      requied: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const GiftcardDiscount = mongoose.model("GiftcardDiscount", discountSchema);
module.exports = GiftcardDiscount;
