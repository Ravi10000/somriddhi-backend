const Otp = require("../models/Otp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");
const Cashback = require("../models/Cashback.model");
const referralCodeGenerator = require("referral-code-generator");

// const sdk = require('api')('@msg91api/v5.0#171eja12lf0xqafw');

exports.sendOtp = async (req, res) => {
  console.log("sendotp ", req.body);
  // const OTP = "1111";

  // generate random otp 4  digit
  const OTP = Math.floor(1000 + Math.random() * 9000);
  //integrate sendotp msg91
  // generate
  console.log(OTP);
  try {
    const newOtp = {
      phone: req.body.phone,
      countryCode: req.body.countryCode,
      otp: OTP,
    };
    console.log(newOtp);

    const options = {
      method: "POST",
      url: "https://control.msg91.com/api/v5/flow/",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: "165254AJVmMEYMU60657de6P1",
      },
      data: JSON.stringify({
        template_id: "640049b6d6fc050d3e0772d3",
        mobiles: "91" + req.body.phone,
        sender: "SMRDHI",
        short_url: "1",
        var1: OTP,
      }),
    };

    axios
      .request(options)
      .then(async function (response) {
        console.log(response.data);
        await Otp.deleteMany({ phone: req.body.phone });
        const otp = await Otp.create(newOtp);
        if (!otp) {
          res.status(400).json({
            status: "Fail",
            message: "Otp does not saved into the database !",
          });
        }
        res.status(200).json({
          status: "success",
          message: "OTP sent Successfully!",
          data: OTP, // delete this in production
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    // integration start with msg91
    // sdk.auth('165254AJVmMEYMU60657de6P1');
    // sdk.sendotp({
    //   countryCode: req.body.countryCode,
    //   otp: OTP
    // }, { mobile: req.body.phone, template_id: '64269770d6fc051f1b7e40c5' })
    //   .then(({ data }) => console.log(data))
    //   .catch(err => console.error(err));
    // integration end with msg91
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  console.log("verifyotp ", req.body);
  try {
    const userRecord = await Otp.findOne({ phone: req.body.phone });
    console.log(userRecord);

    if (userRecord?.otp == req?.body?.otp) {
      // msg91 integration start
      // const options = {
      //   method: 'GET',
      //   url: `https://control.msg91.com/api/v5/otp/verify?otp=${req.body.otp}&mobile=${req.body.phone}`,
      //   headers: { accept: 'application/json', authkey: '165254AJVmMEYMU60657de6P1' }
      // };

      // axios
      //   .request(options)
      //   .then(function (response) {
      //     console.log(response.data);
      //   })
      //   .catch(function (error) {
      //     console.error(error);
      //   });
      // msg91 integration end
      //integrate verifyotp
      const userFound = await User.findOne({
        phone: req.body.phone,
      });
      if (userFound) {
        const token = jwt.sign({ _id: userFound._id }, process.env.JWT_SECRET, {
          expiresIn: "1y",
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
          referralCode: referralCodeGenerator.alpha("uppercase", 12),
        };
        const addedUser = await User.create(newUser);
        // const savedUser = await addedUser.save();
        console.log(addedUser._id);
        const token = jwt.sign({ _id: addedUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1y",
        });
        if (addedUser) {
          res.status(200).json({
            status: "success",
            message: "New user created and details fetched Successfully!",
            user: addedUser,
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
      res.status(400).json({
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
  console.log("body", req?.body);
  console.log("user", req?.user);
  // console.log("user", req.user);
  const { fname, lname, email, phone, referredBy } = req?.body;

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
    if (referredBy) {
      newData.referredBy = referredBy;
    }
    newData.isContactVerified = true;
    // console.log("body", req.body);
    console.log({ newData });
    // Find the note to be updated and update it
    // const record = await User.findById(req.user._id);
    // console.log({ record });
    // if (!record) {
    //   return res.status(404).json({ status: false, message: "Not Found" });
    // }
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
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
  try {
    const allUsers = await User.find();

    const usersCashbacks = allUsers.map(async (user) => {
      const cashback = await Cashback.find({ userId: user?._id });
      if (!cashback) {
        return null;
      }
      return cashback;
    });
    Promise.all(usersCashbacks).then((usersCashbackList) => {
      const earnings = usersCashbackList.map(
        (cashbackList, index) =>
          new Promise((resolve, reject) => {
            // console.log(allUsers[index], cashbackList);
            const totalEarnings = cashbackList.reduce((acc, cashback) => {
              return acc + cashback.amount;
            }, 0);
            const redeemedEarnings = cashbackList.reduce((acc, cashback) => {
              return cashback?.status === "Paid" ? acc + cashback?.amount : acc;
            }, 0);
            const currentDateValue = new Date(2023, 5, 2).valueOf(); // have to change this to new Date()
            const redeemableEarnings = cashbackList.reduce((acc, cashback) => {
              const diff = currentDateValue - cashback.createdAt.valueOf();
              const days = diff / (1000 * 60 * 60 * 24);
              return days > 14 && cashback?.status === "Unpaid"
                ? acc + cashback.amount
                : acc;
            }, 0);
            if (totalEarnings !== 0) {
              console.log({
                totalEarnings,
                redeemedEarnings,
                redeemableEarnings,
              });
            }
            resolve({
              totalEarnings,
              redeemedEarnings,
              redeemableEarnings,
            });
          })
      );
      Promise.all(earnings).then((earningsList) => {
        const finalUsersList = [];
        earningsList?.map((earnings, index) => {
          finalUsersList.push({
            user: allUsers[index],
            earnings,
          });
        });
        res.status(200).json({
          status: "success",
          message: "Record fetched Successfully",
          users: finalUsersList,
        });
      });
    });
    // console.log({ allUsers });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.getRefferedUsers = async (req, res) => {
  try {
    if (!req?.user) {
      return res.status(400).json({
        status: "fail",
      });
    }
    const user = await User.findById(req.user._id).select("referralCode -_id");
    const allUsers = await User.find({ referredBy: user.referralCode });
    res.status(200).json({
      status: "success",
      message: "Record fetched Successfully",
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};
