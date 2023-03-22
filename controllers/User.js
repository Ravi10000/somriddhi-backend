const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { exists } = require("../models/Otp");
// const Error = require("../utils/appError");
// const FormResponseModel = require("../models/FormResponse");
const JWT_SECRET = process.env.JWT_SECRET;

// router.use(bodyparser.urlencoded({ extended: false }));
// router.use(bodyparser.json());

exports.checkAuthentication = async (req, res) => {
  try {
    const doc = await UserModel.findById(req.user.id);
    if (!doc) throw new Error("You are not logged in.", 403);

    res.json({
      status: "success",
      message: "You are logged in.",
      data: doc,
    });
  } catch (err) {
    res.json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log(req.user);
    let userId = req.user._id;
    if (!userId) throw new Error("Not logged in or Session expired.");

    const user = await UserModel.findById(userId);
    // .select("-password");
    console.log({ user });
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { usertype } = req.body;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let totalDocuments = 1;
    if (usertype === undefined || usertype === "") {
      totalDocuments = await UserModel.countDocuments();
      user = await UserModel.find().limit(limit).skip(skip).select("-password");
    } else {
      totalDocuments = await UserModel.countDocuments({ usertype });
      user = await UserModel.find({ usertype: usertype })
        .limit(limit)
        .skip(skip)
        .select("-password");
    }

    const totalPages = Math.ceil(totalDocuments / limit);

    res.json({
      status: true,
      totalPages: totalPages,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    try {
      // Check whether the user with this email exists already
      let user = await UserModel.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          status: false,
          message: "user already registered with same email !",
        });
      }
      countrycode = req.body.phone.substr(0, 1);
      if (countrycode != "+") {
        phonenumber = "+" + req.body.phone;
      } else {
        phonenumber = req.body.phone;
      }
      let usermobile = await UserModel.findOne({ phone: phonenumber });
      if (usermobile) {
        return res.status(400).json({
          status: false,
          message: "user already registered with same mobile !",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await UserModel.create({
        fname: req.body.fname,
        lname: req.body.lname,
        password: secPass,
        email: req.body.email,
        phone: phonenumber,
        usertype: req.body.usertype,
        createdBy: "638dbf6339ecb920ee7f4050",
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user)
      res.json({
        status: true,
        message: "Registered Successfully",
        authtoken: authtoken,
        _id: user.id,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
};
exports.logout = async (req, res) => {
  console.log("logout");
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    await jwt.destroy(token);
    res.send({ staus: "success" });
  } catch (error) {
    res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user)
      throw new Error("Please try to login with correct credentials", 400);

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      throw new Error("Please try to login with correct credentials", 400);
    }

    const data = { user: { id: user.id } };
    const authtoken = jwt.sign(data, JWT_SECRET);

    res.json({
      status: true,
      message: "Loggedin Successfully",
      authtoken: authtoken,
      _id: user.id,
    });
  } catch (error) {
    let status = 500;
    if (error.isOperational) status = error.statusCode;

    res.status(status).send({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  console.log("body", req.body);
  const { fname, lname, email, phone, usertype } = req.body;

  try {
    // Create a newNote object
    const newData = {};
    if (fname) {
      newData.fname = fname;
    }
    if (lname) {
      newData.lname = lname;
    }
    if (email) {
      newData.email = email;
    }
    if (phone) {
      newData.phone = phone;
    }
    if (usertype) {
      newData.usertype = usertype;
    }

    // Find the note to be updated and update it
    let record = await UserModel.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ status: false, message: "Not Found" });
    }

    // if (record.createdBy.toString() !== req.user.id) {
    //   return res.status(401).json({ "status": false, "message": "Not Allowed" });
    // }
    const result = await UserModel.findByIdAndUpdate(req.params.id, newData, {
      new: true,
    });
    // await result.save();

    req.user = result;
    console.log({ result });
    res.json({
      status: true,
      message: "Record Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.phonelogin = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    try {
      const { phone, password } = req.body;
      countrycode = phone.substr(0, 1);
      if (countrycode != "+") {
        phonenumber = "+" + phone;
      } else {
        phonenumber = phone;
      }

      let user = await UserModel.findOne({ phone: phonenumber });
      if (!user) {
        res.status(400).json({
          status: false,
          message: "Please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          status: false,
          message: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({
        status: true,
        message: "Loggedin Successfully",
        authtoken: authtoken,
        _id: user.id,
      });
    } catch (error) {}
  }

  exports.resetPassword = async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const newData = {};
        if (password) {
          newData.password = secPass;
        }

        // Find the note to be updated and update it
        let record = await UserModel.findById(req.params.id);
        if (!record) {
          return res.status(404).json({ status: false, message: "Not Found" });
        }

        // if (record.createdBy.toString() !== req.user.id) {
        //   return res.status(401).json({ "status": false, "message": "Not Allowed" });
        // }
        result = await UserModel.findByIdAndUpdate(
          req.params.id,
          { $set: newData },
          { new: true }
        );
        res.json({
          status: true,
          message: "Record Updated Successfully",
          data: result,
        });
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
    }
  };
};

exports.deleteUser = async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "Not Found" });
    }

    // Allow deletion only if user owns this Note
    // if (course.createdBy.toString() !== req.user.id) {
    //     return res.status(401).json({"status": false, "message":"Not Allowed"});
    // }

    user = await UserModel.findByIdAndDelete(req.params.id);
    res.json({
      status: true,
      message: "Record Deleted Successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// exports.studentAppliedSchools = async (req, res) => {
//   try {
//     // const docs = await FormResponseModel.find({
//       student: req.user.id,
//     }).populate("schoolId");

//     res.json({
//       status: true,
//       message: "Schools fetched Successfully",
//       data: docs,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: false,
//       error: true,
//       message: "Internal Server Error",
//     });
//   }
// };

// module.exports = router;
