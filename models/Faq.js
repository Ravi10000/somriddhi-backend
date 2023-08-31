const mongoose = require("mongoose");
const { Schema } = mongoose;

const FaqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
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
const Faq = mongoose.model("faq", FaqSchema);
module.exports = Faq;
