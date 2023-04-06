const readexcelfile = require("read-excel-file/node");
const reader = require("xlsx");
const Payment = require("../models/Payment");
const Cashback = require("../models/cashback.model");
const CouponAnalytic = require("../models/CouponAnalytic");
const Banner = require("../models/Banner");
const Membership = require("../models/Membership");
const Deal = require("../models/Deal");
const Payout = require("../models/payout");

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
      const actualCashback =
        percentageCashback > coupon?.maxCashback
          ? coupon?.maxCashback
          : percentageCashback;

      const cashback = await Cashback.create({
        amount: actualCashback,
        userId: analytic?.userId,
      });
      console.log({ cashback });
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
      const cashback = await Cashback.findById(row?.cashbackId);

      if (cashback) {
        payout.userId = cashback?.userId;
        await payout.save();
        console.log({ cashback });
        cashback.isRedemeed = true;
        await cashback.save();
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Cashback not found",
        });
      }
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

function excelToJson(file) {
  const excelFile = reader.readFile(`./uploads/${file?.filename}`);
  const firstSheetName = excelFile?.SheetNames[0];
  const firstSheet = excelFile?.Sheets[firstSheetName];
  return reader?.utils?.sheet_to_json(firstSheet); // json data
}
