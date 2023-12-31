const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: String,
  hash: String,
  fname: {
    type: String,
    required: false,
  },
  lname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    // required: true,
    // unique: true,
  },
  isContactVerified: {
    type: Boolean,
    default: false,
    // required: true,
  },
  referralCode: {
    type: String,
    required: false,
  },
  referredBy: {
    type: String,
    required: false,
  },
  usertype: {
    type: String,
    enum: ["customer", "admin"],
    required: true,
    lowercase: true,
  },
  panNo: String,
  entity: {
    type: String,
    enum: ["individual", "business"],
    default: "individual",
    lowercase: true,
  },
  walletId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;

//send otp
//req: phone number, countrycode
//insert in otp

//verify otp
//req: phone number, otp, usertype
//verify with otp model
//succes - authtoken, user(create if number not prosent(iscontactverified - Y), else send user)
//fail - invalid otp

//create user (usertype, phonenumber, fname,lname, email)

//update user (authtokem)
//req: fname, lname, referralCode

//get all users (usertype - optional field)
