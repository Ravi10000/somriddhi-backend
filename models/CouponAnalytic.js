const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponAnalyticSchema = new Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deal",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  startDateTime: {
    type: Date,
    default: Date.now,
  },
  endDateTime: {
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

const CouponAnalytic = mongoose.model("couponanalytic", CouponAnalyticSchema);

module.exports = CouponAnalytic;



//http://localhost:30002/coupon/641be48a1d22769da9c1f8c5&ascsubtag=<_id>