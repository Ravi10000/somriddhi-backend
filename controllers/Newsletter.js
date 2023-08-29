const Newsletter = require("../models/Newsletter");
const User = require("../models/User");

exports.createNewsletter = async (req, res) => {
  try {
    const newsletter = {};
    if (req.body.name) newsletter.name = req.body.name;
    if (req.body.email) newsletter.email = req.body.email;
    if (req.body.status) newsletter.status = req.body.status;
    newsletter.createdBy = req.user._id;
    const newNewsletter = await Newsletter.create(newsletter);
    const record = await newNewsletter.save();
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record created Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not created successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllNewsletters = async (req, res) => {
  try {
    const find = {};
    if (req.body.status) find.status = req.body.status;
    const allNewsletter = await Newsletter.find(find);
    if (allNewsletter) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allNewsletter,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteNewsletter = async (req, res) => {
  try {
    const newsletterId = req.body._id;
    const record = await Newsletter.deleteOne({ _id: newsletterId });
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record delete Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not delete successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.checkIfEmailExists = async (req, res) => {
  console.log("check if user already subscribed to news letter");
  try {
    console.log("req.user", req.user);
    if (req.user) {
      const user = await User.findById(req.user._id);
      const newsletter = await Newsletter.findOne(
        { email: user.email }
        // (err, doc) => {
        //   if (err) console.log({ err });
        //   console.log({ doc });
        // }
      );
      console.log({ newsletter });
      return res.status(200).json({
        status: "success",
        isSubscribed: newsletter ? true : false,
      });
    }
    // res.status(200).json({
    //   status: "success",
    // });
    // const email = req.user.emai;
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
