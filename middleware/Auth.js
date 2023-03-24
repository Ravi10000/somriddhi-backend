const jwt = require("jsonwebtoken");

exports.fetchuser = (req, res, next) => {
  console.log("fetching user");
  console.log("body on fetch user ", req.body);
  console.log("params on fetch user ", req.params);
  console.log("query on fetch user ", req.query);
  //   console.log(req.headers.authorization);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    console.log(!token);
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
    // next();
  } else {
    console.log("no user found");
    // res.status(401).json({ message: "Authorization Required" });
  }
  next();
};

exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    res.status(400).json({ message: "User Access Denied" });
  }
  next();
};

exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(400).json({ message: "Admin Access Denied" });
  }
  next();
};
