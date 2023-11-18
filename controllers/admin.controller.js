const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PasswordResetRequest = require("../models/password-reset-request.model");
const sendResetPasswordLink = require("../utils/send-reset-password-link-email");

module.exports.loginAdmin = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res
        .status(400)
        .json({ message: "userId and password are required" });
    }
    const user = await User.findOne({ email: userId, usertype: "admin" });
    if (!user) {
      return res
        .status(400)
        .json({ message: "not an admin user or user does not exist" });
    }
    if (!user?.hash) {
      return res.status(400).json({ message: "try reset / forgot password" });
    }
    const isMatch = await bcrypt.compare(password, user?.hash);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1y",
    });
    res
      .status(200)
      .json({ status: "success", message: "admin logged in", token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
      error: err.message,
    });
  }
};

module.exports.addAdmin = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res
        .status(400)
        .json({ message: "userId and password are required" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userExists = await User.findOne({ userId });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      userId,
      hash,
      usertype: "admin",
    });
    res.status(200).json({ status: "success", message: "admin created" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
      error: err.message,
    });
  }
};

module.exports.generateResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user || user?.usertype !== "admin") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid request" });
    }
    const resetPasswordRequest = await PasswordResetRequest.create({
      user,
    });
    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordRequest._id}`;
    const emailRes = await sendResetPasswordLink(email, resetPasswordLink);
    console.log({ emailRes });
    console.log({ resetPasswordLink });
    res.status(200).json({
      status: "success",
      message: "Reset Password Link Sent",
      link: resetPasswordLink,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  const { password, requestId } = req.body;
  if (!password || !requestId) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Request" });
  }
  try {
    const request = await PasswordResetRequest.findById(requestId);
    if (!request) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Request" });
    }
    if (request.isUsed) {
      return res
        .status(400)
        .json({ status: "error", message: "Link Already Used" });
    }
    const isLinkExpired =
      Date.now().valueOf() - request.createdAt.valueOf() > 1000 * 60 * 10;
    if (isLinkExpired) {
      return res.status(400).json({ status: "error", message: "Link Expired" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      request.user._id,
      { hash },
      { new: true }
    );
    request.isUsed = true;
    await request.save();

    res.status(200).json({
      status: "success",
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
