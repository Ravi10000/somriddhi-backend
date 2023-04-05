const readexcelfile = require("read-excel-file/node");
let fs = require("fs");
const reader = require("xlsx");
const Payment = require("../models/Payment");
const Cashback = require("../models/cashback.model");
const CouponAnalytic = require("../models/CouponAnalytic");
const Banner = require("../models/Banner");
const Membership = require("../models/Membership");
const Deal = require("../models/Deal");

exports.getExcelData = async (req, res) => {
  try {
    console.log("Files", req?.file);
    const file = reader.readFile(`./uploads/${req?.file?.filename}`);

    const paymentInfo = [];
    const firstSheet = file.SheetNames[0];

    const excelDataInJson = reader.utils.sheet_to_json(file.Sheets[firstSheet]);

    excelDataInJson.forEach((row) => {
      paymentInfo.push(row);
      // console.log({ row });
    });

    const newPayments = paymentInfo.map(async (row) => {
      const payment = await Payment.create(row);
      console.log({ payment });

      const analytic = await CouponAnalytic.findById(row?.trackingId);
      console.log({ analytic });
      if (!analytic) return null;
      let coupon = {};
      if (analytic?.couponType === "Coupon") {
        coupon = await Deal.findById(analytic.couponId);
      } else if (analytic.couponType === "Banner") {
        coupon = await Banner.findById(analytic.couponId);
      } else if (analytic.couponType === "Membership") {
        coupon = await Membership.findById(analytic.couponId);
      }
      console.log({ coupon });

      const percentageBasedCashback =
        payment?.revenue * (coupon?.cashbackPercent / 100);
      const actualCashback =
        percentageBasedCashback > coupon?.maxCashback
          ? coupon?.maxCashback
          : percentageBasedCashback;

      const cashback = await Cashback.create({
        amount: actualCashback,
        userId: analytic?.userId,
      });
      console.log({ cashback });
      return payment;
    });

    // Promise.all(newPayments).then((data) => {
    //  return res.status(200).json({
    //     status: "success",
    //   });
    // });
    // .catch((err) => {
    //   console.log(err);
    //   res.status(500).send("Internal Server Error");
    // });

    // Promise.all(newPayments).then((data) => {
    //   data.forEach(async (payment) => {
    //     const analytic = await CouponAnalytic.findById(payment?.trackingId);
    //     console.log({ analytic, userSpend: data.revenue });
    //   });
    //   // console.log({ data });
    // });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
