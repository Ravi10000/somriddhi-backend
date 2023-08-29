const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContentSchema = new Schema({
  image: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const Content = mongoose.model("Content", ContentSchema);
module.exports = Content;
