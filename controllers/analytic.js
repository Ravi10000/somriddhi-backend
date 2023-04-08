const CategoryAnalytic = require("../models/CategoryAnalytic");
const CouponAnalytic = require("../models/CouponAnalytic");
const Category = require("../models/Category");
const Deal = require("../models/Deal");
const Banner = require("../models/Banner");
const Membership = require("../models/Membership");

exports.fetchAllAnalytic = async (req, res) => {
  console.log("fetch all analytic");
  try {
    const analytics = await CouponAnalytic.find()
      .select("_id userId couponId couponType")
      .populate("userId", "name email phone fname lname -_id")
      .populate("couponId", "name -_id");
    // const categoryAnalytics = await CategoryAnalytic.find().select("_id categoryId userId ").populate(
    //   "userId",
    //   "name email phone"
    // );

    if (!analytics) {
      return res.status(400).json({
        status: "fail",
        message: "No analytic found !",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Analytic fetched Successfully!",
      analytics,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.addCategoryAnalytic = async (req, res) => {
  console.log("add category analytic");
  console.log("body", req.body);
  console.log("user", req.user);

  const analytic = {};
  analytic.userId = req?.user?._id || null;
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
  analytic.userId = req?.user?._id || null;
  analytic.couponId = req?.body?.couponId || null;
  analytic.deviceType = req?.body?.deviceType || null;
  analytic.ipAddress = req?.socket?.remoteAddress || null;
  analytic.startDateTime = req?.body?.startDateTime || null;
  analytic.couponType = req?.body?.couponType || null;
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
      analyticId: updatedAnalytic._id,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
    console.log(error);
  }
};

exports.getCategoryAnalytic = async (req, res) => {
  console.log("get category analytic");
  try {
    const CategoryAnalyticCount = await CategoryAnalytic.countDocuments();
    const analyticData = await CategoryAnalytic.find().distinct("categoryId");

    const finalAnalytics = analyticData.map(async (categoryId) => {
      const category = await Category.findById(categoryId).select("name");
      const count = await CategoryAnalytic.find({
        categoryId,
      }).countDocuments();
      return Array(category?.name, count);
    });
    Promise.all(finalAnalytics).then((data) => {
      res.status(200).json({
        status: "success",
        message: "Analytic data fetched Successfully!",
        analyticData: data,
        totalCount: CategoryAnalyticCount,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getCouponAnalytic = async (req, res) => {
  console.log("get coupon analytic");
  let couponType = req?.params?.couponType || null;

  if (!couponType) return res.status(400).json({ status: "fail" });

  try {
    const couponAnalyticCount = await CouponAnalytic.find({
      couponType,
    }).count();

    const distinctCoupons = await CouponAnalytic.aggregate([
      { $match: { couponType } },
      {
        $group: {
          _id: "$couponId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // const finalAnalytics = [];
    const finalAnalytics = distinctCoupons.map(async (item) => {
      let coupon = {};
      if (couponType === "Coupon")
        coupon = await Deal.findById(item._id).select("name");
      else if (couponType === "Banner")
        coupon = await Banner.findById(item._id).select("name");
      else if (couponType === "Membership")
        coupon = await Membership.findById(item._id).select("name");

      return [coupon?.name, item.count];
    });

    Promise.all(finalAnalytics).then((data) => {
      res.status(200).json({
        status: "success",
        message: "Analytic data fetched Successfully!",
        analyticData: data,
        totalCount: couponAnalyticCount,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
