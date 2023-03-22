const Otp = require("../models/Otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  console.log("sendotp ", req.body);
  const OTP = "1111";
  try {
    const newOtp = {
      phone: req.body.phone,
      countryCode: req.body.countryCode,
      otp: OTP,
    };
    const otp = await Otp.create(newOtp);
    const savedOtp = await otp.save();
    if (!savedOtp) {
      res.status(400).json({
        status: "Fail",
        message: "Otp does not saved into the database !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "OTP sent Successfully!",
      data: OTP,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const userRecord = await Otp.findOne({ phone: req.body.phone });
    if (userRecord.otp == req.body.otp) {
      const userFound = await User.findOne({ phone: req.body.phone });
      if (userFound) {
        const token = jwt.sign({ _id: userFound._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).json({
          status: "success",
          message: "User details fetched Successfully!",
          user: userFound,
          token: token,
        });
      } else {
        const newUser = {
          phone: req.body.phone,
          isContactVerified: true,
          usertype: "customer",
        };
        const addedUser = await User.create(newUser);
        const savedUser = await addedUser.save();
        console.log(savedUser._id);
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        if (savedUser) {
          res.status(200).json({
            status: "success",
            message: "New user created and details fetched Successfully!",
            user: savedUser,
            token: token,
          });
        } else {
          res.status(200).json({
            status: "success",
            message: "New user is not created Successfully!",
          });
        }
      }
    } else {
      res.status(200).json({
        status: "failed",
        message: "Invalid otp",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.newUser = async (req, res) => {
  console.log("newuser");
  console.log(req.headers.authorization);
  console.log("body", req.body);
  console.log("user", req.user);
  const { fname, lname, email, phone, usertype } = req.body;

  // try {
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
  newData.isContactVerified = true;
  // console.log("body", req.body);
  console.log({ newData });
  // Find the note to be updated and update it
  const record = await User.findById(req.user._id);
  console.log({ record });
  if (!record) {
    return res.status(404).json({ status: false, message: "Not Found" });
  }
  const result = await User.findByIdAndUpdate(req.user._id, newData, {
    new: true,
  });
  console.log({ result });
  console.log("end of newuser");
  res.status(200).json({
    status: "success",
    message: "Record Updated Successfully",
    user: result,
  });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
};

exports.updateUser = async (req, res) => {
  const {
    fname,
    lname,
    email,
    phone,
    usertype,
    isContactVerified,
    referralCode,
  } = req.body;

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
    if (isContactVerified) {
      newData.isContactVerified = isContactVerified;
    }
    if (referralCode) {
      newData.referralCode = referralCode;
    }

    // Find the note to be updated and update it
    let record = await User.find({ phone: phone });
    if (!record) {
      return res.status(404).json({ status: false, message: "Not Found" });
    }
    console.log(req.user._id);
    result = await User.updateOne(
      { phone: phone },
      { $set: newData },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: "Record Updated Successfully",
      user: result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUsers = async (req, res) => {
  const find = {};
  if (req.body.usertype) find.usertype = req.body.usertype;
  const allUsers = await User.find(find);
  if (allUsers) {
    res.status(200).json({
      status: "success",
      message: "Record fetched Successfully",
      user: allUsers,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Something Wrong!",
    });
  }
};
