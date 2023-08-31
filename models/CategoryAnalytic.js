const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoryAnalyticSchema = new Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    // required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  clickedOn: {
    type: Date,
    default: Date.now,
  },
  visitedOn: {
    type: Date,
    // default: Date.now,
  },
  deviceType: {
    type: String,
    enum: ["Mobile", "Web"],
  },
  ipAddress: {
    type: String,
  },
});

const CategoryAnalytic = mongoose.model(
  "categoryanalytic",
  CategoryAnalyticSchema
);

module.exports = CategoryAnalytic;
