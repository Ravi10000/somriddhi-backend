const CategoryAnalytic = require("../models/CategoryAnalytic");
const CouponAnalytic = require("../models/CouponAnalytic");

exports.addCategoryAnalytic = async (req, res) => {
  console.log("add category analytic");
  console.log("body", req.body);
  console.log("user", req.user);

  const analytic = {};
  analytic.userId = req?.body?.userId || null;
  analytic.categoryId = req?.body?.categoryId || null;
  analytic.deviceType = req?.body?.deviceType || null;
  analytic.ipAddress = req.ip || null;
  analytic.clickedOn = req?.body?.clickedOn || null;
  try {
    const newAnalytic = await CategoryAnalytic.create(analytic);
    console.log({ newAnalytic });
    if (!newAnalytic) {
      return res.status(400).json({
        status: "fail",
        message: "Analytic does not saved into the database !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Analytic added Successfully!",
      analyticId: newAnalytic._id,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
    console.log(error);
  }
};
exports.updateCategoryAnalytic = async (req, res) => {
  // analytic.visitedOn = req?.body?.visitedOn || null;
  const visitedOn = req?.body?.visitedOn || null;
  const analyticId = req?.body?.analyticId;
  try {
    const updatedAnalytic = await CategoryAnalytic.findByIdAndUpdate(
      analyticId,
      {
        visitedOn,
      },
      { new: true }
    );
    console.log({ updatedAnalytic });
    if (!updatedAnalytic) {
      return res.status(400).json({
        status: "fail",
        message: "Analytic does not updated into the database !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Analytic updated Successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
    console.log(error);
  }
};

exports.addCouponAnalytic = async (req, res) => {
  console.log("add coupon analytic");
  console.log("body", req.body);
  const analytic = {};
  analytic.userId = req?.body?.userId || null;
  analytic.couponId = req?.body?.couponId || null;
  analytic.deviceType = req?.body?.deviceType || null;
  analytic.ipAddress = req?.socket?.remoteAddress || null;
  analytic.startDateTime = req?.body?.startDateTime || null;
  analytic.endDateTime = req?.body?.endDateTime || null;
  try {
    const newAnalytic = await CouponAnalytic.create(analytic);
    console.log({ newAnalytic });

    if (!newAnalytic) {
      return res.status(400).json({
        status: "fail",
        message: "Analytic does not saved into the database !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Analytic added Successfully!",
      analyticId: newAnalytic._id,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCouponAnalytic = async (req, res) => {
  console.log("update coupon analytic");
  console.log("body", req.body);
  // analytic.visitedOn = req?.body?.visitedOn || null;
  const endDateTime = req?.body?.endDateTime || null;
  const analyticId = req?.body?.analyticId;
  try {
    const updatedAnalytic = await CouponAnalytic.findByIdAndUpdate(
      analyticId,
      {
        endDateTime,
      },
      { new: true }
    );
    console.log({ updatedAnalytic });
    if (!updatedAnalytic) {
      return res.status(400).json({
        status: "fail",
        message: "Analytic does not updated into the database !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Analytic updated Successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
    console.log(error);
  }
};
