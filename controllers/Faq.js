const Faq = require("../models/Faq");

exports.createFaq = async (req, res) => {
  try {
    const faq = {};
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;
    faq.createdBy = req.user._id;
    const newFaq = await Faq.create(faq);
    const record = await newFaq.save();
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

exports.getFaqs = async (req, res) => {
  try {
    const allFaqs = await Faq.find({});
    if (allFaqs) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allFaqs,
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

exports.updateFaq = async (req, res) => {
  try {
    const faqId = req.body._id;
    const faq = {};
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;
    faq.createdBy = req.user._id;
    const record = await Faq.findByIdAndUpdate(
      faqId,
      { $set: faq },
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

exports.deleteFaq = async (req, res) => {
  console.log("deleting faq");
  console.log("params", req.params);
  try {
    const faqId = req.params.id;
    const record = await Faq.deleteOne({ _id: faqId });
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
