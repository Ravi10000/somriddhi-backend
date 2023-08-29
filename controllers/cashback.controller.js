const Cashback = require("../models/Cashback.model");
const PaymentRequest = require("../models/PaymentRequest");

exports.generateCashback = async (req, res) => {
  console.log("generate cashback");
  const userId = req?.user?._id;
  const amount = req?.body?.amount;

  if (!userId)
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });

  try {
    const newCashback = await Cashback.create({ userId, amount });
    res.status(200).json({
      status: "success",
      message: "Cashback generated successfully",
      cashbackId: newCashback,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getCashbackDetails = async (req, res) => {
  const userId = req?.user?._id;
  if (!userId)
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  try {
    const cashbackList = await Cashback.find({ userId });

    const totalCashback = cashbackList.reduce((acc, cashback) => {
      return acc + cashback.amount;
    }, 0);

    const redemeedCashback = cashbackList.reduce((acc, cashback) => {
      return cashback?.status === "Paid" ? acc + cashback?.amount : acc;
    }, 0);

    // const currentDateValue = new Date().valueOf();
    const currentDateValue = new Date(2023, 5, 2).valueOf(); // have to change this to above line
    const redemableCashback = cashbackList.reduce((acc, cashback) => {
      const diff = currentDateValue - cashback.createdAt.valueOf();
      const days = diff / (1000 * 60 * 60 * 24);
      return days > 14 && cashback?.status === "Unpaid"
        ? acc + cashback.amount
        : acc;
    }, 0);

    if (!cashbackList)
      return res.status(400).json({
        status: "fail",
        message: "Cashback not found",
      });
    res.status(200).json({
      status: "success",
      message: "Cashback details fetched successfully",
      totalCashback,
      redemeedCashback,
      redemableCashback,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.fetchRedeemableCashbacks = async (req, res) => {
  if (!req?.user) {
    res.status(401).json({
      status: "fail",
      message: "Invalid request",
    });
  }
  try {
    const allCashbacks = await Cashback.find({
      userId: req?.user?._id,
      status: "Unpaid",
    }).select("id amount createdAt");
    console.log({ allCashbacks });
    // const currentDateValue = new Date().valueOf();
    const currentDateValue = new Date(2023, 5, 2).valueOf(); // have to change this to above line
    const redeemableCashbacks = allCashbacks.filter((cashback) => {
      // console.log({ cashback });
      const diff = currentDateValue - cashback?.createdAt?.valueOf();
      const days = diff / (1000 * 60 * 60 * 24);
      // console.log({ days });
      return days > 14;
    });
    // console.log({ redeemableCashbacks });
    res.status(200).json({
      status: "success",
      message: "Redeemable cashback fetched successfully",
      redeemableCashbacks,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.redeemCashback = async (req, res) => {
  console.log("generate payment request");
  if (!req?.user) {
    res.status(401).json({
      status: "fail",
      message: "Invalid request",
    });
  }
  try {
    console.log(req?.body);
    const cashbackIds = Object.values(req?.body);

    console.log({ cashbackIds });
    await Cashback.updateMany(
      {
        _id: { $in: cashbackIds },
      },
      { status: "Requested" }
    );
    const cashbacks = await Cashback.find({ _id: { $in: cashbackIds } }).select(
      "amount"
    );

    console.log({ cashbacks });
    const totalAmount = cashbacks.reduce((acc, cashback) => {
      return acc + cashback.amount;
    }, 0);
    // const totalAmount = await Cashback.aggregate([
    //   { $match: { _id: { $in: cashbackIds } } },
    //   // { $group: { _id: null, total: { $sum: "amount" } } },
    // ]);
    console.log({ totalAmount });

    const paymentRequest = await PaymentRequest.create({
      userId: req?.user?._id,
      redeemedList: cashbackIds,
      totalAmount,
      status: "Unpaid",
      createdAt: Date.now(),
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.fetchMyCashbacks = async (req, res) => {
  console.log("fetch my cashbacks");
  if (!req?.user) {
    res.status(401).json({
      status: "fail",
      message: "Invalid request",
    });
  }
  const cashbacks = await Cashback.find({ userId: req?.user?._id });

  res.status(200).json({
    status: "success",
    message: "Cashbacks fetched successfully",
    cashbacks,
  });
};
