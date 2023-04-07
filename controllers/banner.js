const Banner = require("../models/Banner");

exports.createBanner = async (req, res) => {
  try {
    const banner = {};
    if (req.body.name) banner.name = req.body.name;
    console.log(req.file);
    if (req.file.filename) banner.image = req.file.filename;
    if (req.body.cashbackPercent)
      banner.cashbackPercent = req.body.cashbackPercent;
    if (req.body.maxCashback) banner.maxCashback = req.body.maxCashback;
    if (req.body.description) banner.description = req.body.description;
    if (req.body.url) banner.url = req.body.url;
    if (req.body.status) banner.status = req.body.status;
    banner.createdBy = req.user._id;
    const bannersCount = await Banner.countDocuments({});
    const newBanner = await Banner.create({
      banner,
      priorityOrder: bannersCount + 1,
    });
    const record = await newBanner.save();
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

exports.getBanners = async (req, res) => {
  try {
    const allBanners = await Banner.find({}).sort({ priorityOrder: "asc" });
    if (allBanners) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allBanners,
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

exports.changeStatus = async (req, res) => {
  try {
    const { bannerId, status } = req.body;
    const banner = await Banner.findByIdAndUpdate(bannerId, { status });

    if (!banner) {
      res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
    res.status(200).json({
      status: "success",
      message: `${banner?.name} banner is now ${status}!`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "Active" }).sort({
      priorityOrder: "asc",
    });

    if (!banners) {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Records fetched Successfully!",
      banners,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.changePriorityOrder = async (req, res) => {
  try {
    const { bannerId, NewPriorityOrder } = req.body;

    const banners = await Banner.find({}).sort({ priorityOrder: "asc" });
    const targetBanner = await Banner.findById(bannerId);

    const finalList = banners.map(async (banner, index) => {
      return new Promise(async (resolve, reject) => {
        if (targetBanner.priorityOrder < NewPriorityOrder) {
          for (
            let i = targetBanner.priorityOrder + 1;
            i <= NewPriorityOrder;
            i++
          ) {
            if (banner.priorityOrder === i) {
              banner.priorityOrder = i - 1;
              await banner.save();
            }
          }
        }
        if (targetBanner.priorityOrder > NewPriorityOrder) {
          for (
            let i = targetBanner.priorityOrder - 1;
            i <= NewPriorityOrder;
            i--
          ) {
            if (banner.priorityOrder === i) {
              banner.priorityOrder = i + 1;
              await banner.save();
            }
          }
        }
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getBannerById = async (req, res) => {
  console.log("fetch banner by id");
  const bannerId = req?.params?.id;
  console.log("bannerId", req.params);
  if (bannerId) {
    const banner = await Banner.findById(bannerId);
    if (banner) {
      return res.status(200).json({
        status: "success",
        message: "Record fetched Successfully!",
        banner,
      });
    }
  }
  return res.status(400);
};

exports.updateBanner = async (req, res) => {
  console.log("update banner");
  // console.log("body", req.body);
  // console.log("user", req.user);
  try {
    const bannerId = req.body._id;
    const banner = {};
    if (req.body.name) banner.name = req.body.name;
    if (req?.file?.filename) banner.image = req.file.filename;
    if (req.body.bannerPhoto) banner.image = req.body.bannerPhoto;
    if (req.body.cashbackPercent)
      banner.cashbackPercent = req.body.cashbackPercent;
    if (req.body.maxCashback) banner.maxCashback = req.body.maxCashback;
    if (req.body.description) banner.description = req.body.description;
    if (req.body.url) banner.url = req.body.url;
    if (req.body.status) banner.status = req.body.status;
    banner.createdBy = req.user._id;
    const record = await Banner.findByIdAndUpdate(
      bannerId,
      { $set: banner },
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
    console.log({ err });
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteBanner = async (req, res) => {
  console.log("delete banner");
  console.log("params", req.params);

  try {
    const bannerId = req.params.id;
    const record = await Banner.deleteOne({ _id: bannerId });
    // res.status(200).json({
    //   status: "success",
    //   message: "Record delete Successfully!",
    // });
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
