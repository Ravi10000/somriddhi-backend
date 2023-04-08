const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.fetchuser = (req, res, next) => {
  console.log("fetching user");
  console.log("body on fetch user ", req.body);
  console.log("params on fetch user ", req.params);
  console.log("query on fetch user ", req.query);
  console.log("files on fetch user ", req?.file);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    // console.log(!token);
    //jwt.decode
    if (token == "null") {
      req.user = null;
      return next();
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    //user _id decode hojayegi
    // this is how we are going to manage user session
    console.log({ user });
    req.user = user;
    console.log("user fetched and sent successfully");
    return next();
  } else {
    console.log("no user found");
  }
  next();
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
