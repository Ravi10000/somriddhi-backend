const Membership = require("../models/Membership");

exports.createMembership = async (req, res) => {
  try {
    const membership = {};
    if (req.body.name) membership.name = req.body.name;
    if (req.file.filename) membership.image = req.file.filename;
    if (req.body.description) membership.description = req.body.description;
    if (req.body.url) membership.url = req.body.url;
    if (req.body.status) membership.status = req.body.status;
    if (req.body.cashbackPercent)
      membership.cashbackPercent = req.body.cashbackPercent;
    membership.createdBy = req.user._id;
    const newMembership = await Membership.create(membership);
    const record = await newMembership.save();
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

exports.getMemberships = async (req, res) => {
  try {
    const find = {};
    if (req.body.status) find.status = req.body.status;
    const allMemberships = await Membership.find(find);
    if (allMemberships) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allMemberships,
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

exports.updateMembership = async (req, res) => {
  console.log("update membership");
  console.log("body", req.body);
  console.log("file", req.file);

  try {
    const membershipId = req.body._id;
    const membership = {};
    if (req.file.filename) membership.image = req.file.filename;
    if (req.body.name) membership.name = req.body.name;
    if (req.body.description) membership.description = req.body.description;
    if (req.body.url) membership.url = req.body.url;
    if (req.body.status) membership.status = req.body.status;
    if (req.body.cashbackPercent)
      membership.cashbackPercent = req.body.cashbackPercent;
    membership.createdBy = req.user._id;
    const record = await Membership.findByIdAndUpdate(
      membershipId,
      { $set: membership },
      { new: true }
    );
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record updated Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    const membershipId = req.params.id;
    const record = await Membership.deleteOne({ _id: membershipId });
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
