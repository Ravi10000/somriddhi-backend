const Cashback = require("../models/cashback.model");

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
      return cashback.isRedemeed ? acc + cashback.amount : acc;
    }, 0);

    const redemableCashback = cashbackList.reduce((acc, cashback) => {
      // redemable after 14 days
      const diff = new Date().valueOf() - cashback.createdAt.valueOf();
      const days = diff / (1000 * 60 * 60 * 24);
      return days > 14 && !cashback.isRedemeed ? acc + cashback.amount : acc;
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
