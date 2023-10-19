const mongoose = require("mongoose");

const sentGiftcardSchema = new mongoose.Schema({
  senderName: String,
  receiverName: String,
  receiverPhone: String,
  receiverEmail: String,
  giftcard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GiftCard",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const SentGiftcard = mongoose.model("SentGiftcard", sentGiftcardSchema);
module.exports = SentGiftcard;
