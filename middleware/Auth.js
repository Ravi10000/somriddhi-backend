const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.fetchuser = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log({ token });
      if (token == "null" || !token) {
        req.user = null;
        return next();
      }
      const user = jwt.verify(token, process.env.JWT_SECRET);
      console.log({ user });
      req.user = user;
    } else {
      console.log("no user found");
    }
  } catch (err) {
    console.log({ err });
  } finally {
    next();
  }
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    res.status(400).json({ message: "User Access Denied" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  if (user?.usertype !== "admin") {
    return res.status(401).json({ message: "Admin Access Denied" });
  }
  next();
};
