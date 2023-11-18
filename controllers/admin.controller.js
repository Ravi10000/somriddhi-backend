const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.loginAdmin = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res
        .status(400)
        .json({ message: "userId and password are required" });
    }
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.hash);
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
    console.log(err.message);
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
