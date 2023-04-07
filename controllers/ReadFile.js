const readexcelfile = require("read-excel-file/node");
const reader = require("xlsx");
const Payment = require("../models/Payment");
const Cashback = require("../models/Cashback.model");
const CouponAnalytic = require("../models/CouponAnalytic");
const Banner = require("../models/Banner");
const Membership = require("../models/Membership");
const Deal = require("../models/Deal");
const Payout = require("../models/payout");
const PaymentRequest = require("../models/PaymentRequest");
const User = require("../models/User");

exports.fetchAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({
      status: "success",
      message: "Payments fetched Successfully!",
      payments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.fetchAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find();
    res.status(200).json({
      status: "success",
      message: "Payments fetched Successfully!",
      payouts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.generateCashback = async (req, res) => {
  console.log("generate cashback");
  try {
    const paymentInfo = excelToJson(req?.file);
    const newPayments = paymentInfo.map(async (row) => {
      const payment = await Payment.create(row);
      console.log({ payment });

      const analytic = await CouponAnalytic.findById(row?.trackingId);
      // console.log({ analytic });
      if (!analytic) return null;
      let coupon = {};
      if (analytic?.couponType === "Coupon") {
        coupon = await Deal.findById(analytic.couponId);
      } else if (analytic.couponType === "Banner") {
        coupon = await Banner.findById(analytic.couponId);
      } else if (analytic.couponType === "Membership") {
        coupon = await Membership.findById(analytic.couponId);
      }
      // console.log({ coupon });

      const percentageCashback =
        payment?.revenue * (coupon?.cashbackPercent / 100);
      var actualCashback =
        percentageCashback > coupon?.maxCashback
          ? coupon?.maxCashback
          : percentageCashback;

      console.log(actualCashback);

      if (!actualCashback) actualCashback = 0;

      if (actualCashback != 0) {
        const cashback = await Cashback.create({
          amount: actualCashback,
          userId: analytic?.userId,
        });
        console.log({ cashback });
      }
      return payment;
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.updatePayouts = async (req, res) => {
  try {
    const payoutData = excelToJson(req?.file);

    payoutData.forEach(async (row) => {
      const payout = await Payout.create(row);
      console.log({ payout });
      const user = await User.findOne({ walletId: row?.walletId }).select(
        "_id"
      );
      const paymentRequestList = await PaymentRequest.find({
        userId: user?._id,
      }).select("redeemedList");

      paymentRequestList?.forEach(async (paymentRequest) => {
        paymentRequest.status = "Paid";
        await paymentRequest.save();
        console.log({ paymentRequest });

        const singleRequest = await PaymentRequest.findById(
          paymentRequest?._id
        ).populate("redeemedList");

        singleRequest?.redeemedList?.forEach(async (cashback) => {
          cashback.status = "Paid";
          await cashback.save();
        });

        console.log({ singleRequest });
        console.log({ array: singleRequest?.redeemedList });
      });
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.generateRequest = async (req, res) => {
  if (!req?.user) {
    res.status(401).json({
      status: "fail",
      message: "Invalid request",
    });
  }
  try {
    const paymentRequest = {};
    if (req?.body?.redeemRequestList) {
      const { redeemedList } = req?.body;
      paymentRequest.redeemRequestList = redeemedList;
      let totalAmount = 0;
      redeemedList.forEach(async (cashbackId) => {
        const cashback = await Cashback.findById(cashbackId).select("amount");
        totalAmount += cashback?.amount;
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Invalid request",
    });
  }
};

function excelToJson(file) {
  const excelFile = reader.readFile(`./uploads/${file?.filename}`);
  const firstSheetName = excelFile?.SheetNames[0];
  const firstSheet = excelFile?.Sheets[firstSheetName];
  return reader?.utils?.sheet_to_json(firstSheet); // json data
}
