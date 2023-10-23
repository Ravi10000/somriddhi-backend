const GiftCard = require("../models/GiftCardModel");
const SentGiftcard = require("../models/sent-giftcard.model");
const moment = require("moment");
const sendVoucherEmail = require("../utils/send-voucher-email");
const { sendVoucherSms } = require("../utils/send-voucher-sms");
const Transaction = require("../models/Transaction.model");

module.exports.sendGiftcard = async (req, res, next) => {
  try {
    const {
      senderName,
      receiverName,
      receiverPhone,
      receiverEmail,
      giftcard: giftcardId,
    } = req.body;

    console.log({ body: req.body });

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

    const transaction = await Transaction.findById(giftcard?.transaction);
    let paymentid = null;
    let transactionResponse = null;

    if (transaction?.method === "phonepe") {
      transactionResponse =
        (await JSON.parse(transaction?.phonePeResponse)) || null;
      paymentid = transactionResponse?.data?.transactionId || null;
    } else if (transaction?.method === "yespay") {
      transactionResponse =
        (await JSON.parse(transaction?.yesPayResponse)) || null;
      paymentid =
        transactionResponse?.transaction_details?.transaction_no || null;
    }

    const activatedCardRes = JSON.parse(giftcard?.activatedCardRes);
    let voucher = activatedCardRes?.cards?.[0];
    let voucherDetails = {
      name: receiverName,
      senderName,
      giftCardId: giftcard?._id,
      refno: giftcard.refno,
      transactionId: paymentid,
      amount: voucher?.amount,
      voucherCode: voucher?.cardPin,
      validity: moment(voucher?.validity).format("YYYY/MM/DD"),
      orderId: giftcard?.transaction,
    };
    console.log({ voucherDetails });
    await sendVoucherEmail(receiverEmail, voucherDetails);
    await sendVoucherSms(receiverPhone, voucherDetails);
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
