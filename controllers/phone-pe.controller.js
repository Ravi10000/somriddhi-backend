const axios = require("axios");
const { createHmac } = require("crypto");
const base64 = require("base-64");
const Transaction = require("../models/Transaction.model");

module.exports.initiatePayment = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    if (!transaction) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
    const payload = `{
      "merchantId": "MERCHANTUAT",
      "merchantTransactionId": "MT7850590068188104",
      "merchantUserId": "MUID123",
      "amount": 10000,
      "redirectUrl": "https://webhook.site/redirect-url",
      "redirectMode": "REDIRECT",
      "callbackUrl": "https://webhook.site/callback-url",
      "mobileNumber": "9999999999",
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    }`;
    const base64EncodedPayload = base64.encode(payload);
    const hash = createHmac("sha256", process.env.PHONEPE_PAY_SECRET)
      .update(
        base64EncodedPayload + "/pg/v1/pay" + process.env.PHONEPE_PAY_SALT
      )
      .digest("hex");

    const options = {
      method: "POST",
      url: process.env.PHONEPE_PAY_LINK,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "x-verify": hash + "###" + 1,
      },
      data: {
        request: base64EncodedPayload,
      },
    };
    // const response = await axios.request(options);
    // console.log({ response });

    res.status(200).json({
      message: "Payment Initiated",
      base64EncodedPayload,
      request: finalHash,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
