const Banner = require("../models/Banner");

exports.createBanner = async (req, res) => {
  console.log("createBanner");
  try {
    console.log({ user: req?.user });
    console.log({ body: req?.body });
    console.log({ file: req?.file });
    const banner = {};
    if (req.body.name) banner.name = req.body.name;
    if (req.file.filename) banner.image = req.file.filename;
    if (req.body.cashbackPercent)
      banner.cashbackPercent = req.body.cashbackPercent;
    if (req.body.maxCashback) banner.maxCashback = req.body.maxCashback;
    if (req.body.priorityOrder) banner.priorityOrder = req.body.priorityOrder;
    if (req.body.description) banner.description = req.body.description;
    if (req.body.url) banner.url = req.body.url;
    if (req.body.status) banner.status = req.body.status;
    banner.createdBy = req.user._id;
    console.log({ banner });
    const newBanner = await Banner.create(banner);
    if (newBanner) {
      res.status(200).json({
        status: "success",
        message: "Record created Successfully!",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not created successfully!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getBanners = async (req, res) => {
  console.log("getBanners");
  try {
    const allBanners = await Banner.find().sort({
      priorityOrder: "asc",
    });
    // const allActiveBanners = await Banner.find({ status: "Active" }).sort({
    //   priorityOrder: "asc",
    // });
    // const allInactiveBanners = await Banner.find({ status: "Inactive" }).sort({
    //   priorityOrder: "asc",
    // });
    if (allBanners) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        banners: allBanners,
        // banners: [...allActiveBanners, ...allInactiveBanners],
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
  console.log("change priority order");
  try {
    const { bannerId, newPriorityOrder } = req?.body;

    if (!bannerId || !newPriorityOrder) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid request",
      });
    }

    const banners = await Banner.find({}).sort({ priorityOrder: "asc" });
    const targetBanner = await Banner.findById(bannerId);
    const tp = targetBanner?.priorityOrder;

    if (tp === newPriorityOrder) {
      return res.status(200).json({
        status: "success",
        message: "Priority order unchanged",
        banners,
      });
    } else if (tp < newPriorityOrder) {
      const updatedBannerList = banners?.map(async (banner, index) => {
        let bp = banner?.priorityOrder;
        if (!(bp >= tp) || !(bp <= newPriorityOrder)) {
          return banner;
        }
        if (bp === tp) {
          banner.priorityOrder = newPriorityOrder;
          await banner.save();
          return banner;
        }
        banner.priorityOrder = index;
        await banner.save();
        return banner;
      });

      Promise.all(updatedBannerList).then((bannerList) => {
        console.log("bannerList", bannerList);
        res.status(200).json({
          status: "success",
          bannerList,
        });
      });
    } else if (tp > newPriorityOrder) {
      const updatedBannerList = banners?.map(async (banner, index) => {
        let bp = banner?.priorityOrder;
        if (!(bp >= newPriorityOrder) || !(bp <= tp)) {
          return banner;
        }
        if (bp === tp) {
          banner.priorityOrder = newPriorityOrder;
          await banner.save();
          return banner;
        }
        banner.priorityOrder = index + 2;
        await banner.save();
        return banner;
      });

      Promise.all(updatedBannerList).then((bannerList) => {
        res.status(200).json({
          status: "success",
          bannerList,
        });
      });
    }
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
    if (req.body.priorityOrder) banner.priorityOrder = req.body.priorityOrder;
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
