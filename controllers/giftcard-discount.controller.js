const GiftcardDiscount = require("../models/giftcard-discount.model");

module.exports.manageGiftcardDiscount = async (req, res, next) => {
  try {
    const { discountPercentage } = req.body;
    const user = req?.user;
    console.log({ user });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "unauthorised",
      });
    }
    let discount = await GiftcardDiscount.findOneAndUpdate({
      discountPercentage,
      updatedBy: user._id,
    });
    if (!discount) {
      discount = await GiftcardDiscount.create({
        discountPercentage,
        createdBy: user._id,
        updatedBy: user._id,
      });
    }
    res.status(200).json({
      status: "success",
      message: "discount set successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchDiscount = async (req, res, next) => {
  try {
    const discount = await GiftcardDiscount.findOne();
    if (!discount)
      return res.status(404).json({
        status: "error",
        message: "no disocunt found",
      });
    res.status(200).json({
      status: "success",
      message: "disocunt fetched",
      discount,
    });
  } catch (err) {
    next(err);
  }
};
