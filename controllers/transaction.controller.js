const Transaction = require("../models/Transaction.model");

exports.createTransaction = async (req, res) => {
  try {
    console.log({ body: req.body });
    if (!req.user)
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    let { response: yesPayResponse } = req.body;
    yesPayResponse = JSON.parse(JSON.parse(yesPayResponse));
    console.log({ yesPayResponse });
    const transaction = await Transaction.findById(yesPayResponse.request_id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    transaction.status =
      yesPayResponse.transaction_details.transaction_status.toLowerCase();
    transaction.yesPayResponse = JSON.stringify(yesPayResponse);
    await transaction.save();

    res.redirect("http://localhost:3002/payment-status/" + transaction._id);
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    res.status(200).json({ status: "success", transaction });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};
