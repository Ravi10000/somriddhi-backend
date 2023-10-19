const GiftCard = require("../models/GiftCardModel");
const SentGiftcard = require("../models/sent-giftcard.model");
const moment = require("moment");
const sendVoucherEmail = require("../utils/send-voucher-email");

module.exports.sendGiftcard = async (req, res, next) => {
  try {
    const {
      senderName,
      receiverName,
      receiverPhone,
      receiverEmail,
      giftcard: giftcardId,
    } = req.body;
    const user = req?.user?._id;
    if (!user)
      return res.status(400).json({
        status: "error",
        message: "user not found",
      });
    const giftcard = await GiftCard.findById(giftcardId);
    if (!giftcard)
      return res.status(400).json({
        status: "error",
        message: "giftcard not found",
      });

    const activatedCardRes = JSON.parse(giftcard?.activatedCardRes);
    let voucher = activatedCardRes?.data?.cards?.[0];
    let voucherDetails = {
      name: receiverName,
      giftCardId: giftcard?._id,
      amount: voucher?.amount,
      voucherCode: voucher?.cardPin,
      validity: moment(voucher?.validity).format("YYYY/MM/DD"),
      orderId: giftcard?.transaction,
    };
    await sendVoucherEmail(receiverEmail, voucherDetails);
    const sentGiftCard = await SentGiftcard.create({
      senderName,
      receiverName,
      receiverPhone,
      receiverEmail,
      user,
      giftcard: giftcardId,
    });
    res.status(200).json({
      status: "success",
      message: "giftcard sent successfully",
      sentGiftCard,
    });
  } catch (err) {
    console.log({ err });
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
    // next(err);
  }
};
