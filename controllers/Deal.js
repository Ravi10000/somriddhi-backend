const Deal = require("../models/Deal");

exports.createDeal = async (req, res) => {
  try {
    const deal = {};
    if (req.body.name) deal.name = req.body.name;
    if (req.body.description) deal.description = req.body.description;
    if (req.file.filename) deal.image = req.file.filename;
    if (req.body.url) deal.url = req.body.url;
    if (req.body.categoryId) deal.categoryId = req.body.categoryId;
    if (req.body.cashbackPercent)
      deal.cashbackPercent = req.body.cashbackPercent;
    if (req.body.maxCashback) deal.maxCashback = req.body.maxCashback;
    if (req.body.liveDate) deal.liveDate = req.body.liveDate;
    if (req.body.expiryDate) deal.expiryDate = req.body.expiryDate;
    deal.createdBy = req.user._id;
    const newDeal = await Deal.create(deal);
    const record = await newDeal.save();
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

exports.getAllDeals = async (req, res) => {
  console.log("body", req.params);
  try {
    const find = {};
    if (req.params.categoryId) find.categoryId = req.params.categoryId;
    const allDeals = await Deal.find(find);
    if (allDeals) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allDeals,
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
exports.getDealById = async (req, res) => {
  console.log("fetch deal by id");
  const dealId = req.params.id;
  console.log("dealId", req.params);
  if (dealId) {
    const deal = await Deal.findById(dealId);
    if (deal) {
      return res.status(200).json({
        status: "success",
        message: "Record fetched Successfully!",
        deal: deal,
      });
    }
  }
  return res.status(400);
};

exports.updateDeal = async (req, res) => {
  console.log("updating deal");
  console.log("body", req.body);
  try {
    const dealId = req.body._id;
    const deal = {};
    if (req.body.name) deal.name = req.body.name;
    if (req.body.description) deal.description = req.body.description;
    if (req?.file?.filename) deal.image = req.file.filename;
    if (req.body.url) deal.url = req.body.url;
    if (req.body.categoryId) deal.categoryId = req.body.categoryId;
    if (req.body.cashbackPercent)
      deal.cashbackPercent = req.body.cashbackPercent;
    if (req.body.maxCashback) deal.maxCashback = req.body.maxCashback;
    if (req.body.liveDate) deal.liveDate = req.body.liveDate;
    if (req.body.expiryDate) deal.expiryDate = req.body.expiryDate;
    deal.createdBy = req.user._id;
    const record = await Deal.findByIdAndUpdate(
      dealId,
      { $set: deal },
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

exports.deleteDeal = async (req, res) => {
  console.log("deleting deal");
  console.log("params", req.params);
  try {
    const dealId = req.params.id;
    const record = await Deal.deleteOne({ _id: dealId });
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
