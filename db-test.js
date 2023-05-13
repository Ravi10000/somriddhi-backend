const referralCodeGenerator = require("referral-code-generator");
const User = require("./models/User");
const Deal = require("./models/Deal");
const Category = require("./models/Category");
const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

// async function insertReferralCode() {
//   const users = await User.find();
//   users.forEach(async (user) => {
//     const referralCode = referralCodeGenerator.alpha("uppercase", 12);
//     user.referralCode = referralCode;
//     user.isContactVerified = true;
//     await user.save();
//     console.log({ user });
//   });
// }

// insertReferralCode();

async function searchDeals() {
  const deals = await Deal.find({ $text: { $search: "amazon" } });
  const categories = await Category.find({ $text: { $search: "beauty" } });
  console.log({ deals, categories });
}

searchDeals();
