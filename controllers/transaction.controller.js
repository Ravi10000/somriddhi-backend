const axios = require("axios");
const Transaction = require("../models/Transaction.model");
const { encodeRequest } = require("../utils/encode-request");

exports.createTransaction = async (req, res) => {
  try {
    console.log("initiated transaction");
    console.log({ body: req.body });
    if (!req.user)
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    console.log({ transaction });
    let redirectUrl = null;
    if (req?.body?.method === "phonepe") {
      const payload = `{
        "merchantId": "${process.env.PHONEPE_PAY_MERCHANT_ID}",
        "merchantTransactionId": "${transaction._id}",
        "merchantUserId": "${req.user._id}",
        "amount": ${parseInt(req.body.amount) * 100},
        "redirectUrl": "${process.env.PHONEPE_PAY_REDIRECT_URL}/${
        transaction?._id
      }",
        "redirectMode": "REDIRECT",
        "callbackUrl": "${process.env.PHONEPE_PAY_CALLBACK_URL}",
        "mobileNumber": "${req.body.mobile}",
        "paymentInstrument": {
          "type": "PAY_PAGE"
        }
      }`;
      const { encodedPayload, hash } = encodeRequest(payload);
      const xVerify = hash + "###" + process.env.PHONEPE_PAY_SALT_INDEX;
      const options = {
        method: "POST",
        url: process.env.PHONEPE_PAY_LINK + "/pay",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-verify": xVerify,
        },
        data: {
          request: encodedPayload,
        },
      };
      const { data } = await axios(options);
      console.log(JSON.stringify(data));
      redirectUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
    }
    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction,
      redirectUrl,
    });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  console.log("update yes pe transaction status");
  try {
    let { response: yesPayResponse } = req.body;
    yesPayResponse = JSON.parse(yesPayResponse);
    console.log({ yesPayResponse });
    const transaction = await Transaction.findById(yesPayResponse.request_id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    transaction.status =
      yesPayResponse.transaction_details.transaction_status.toLowerCase();
    transaction.yesPayResponse = JSON.stringify(yesPayResponse);
    await transaction.save();

    res.redirect("https://somriddhi.store/payment-status/" + transaction._id);
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateTransactionPhonepe = async (req, res) => {
  console.log("update phone pe transaction status");
  try {
    let { response: phonePayResponse } = req.body;
    console.log({ phonePayResponse });
    const transaction = await Transaction.findById(
      phonePayResponse.data.merchantTransactionId
    );
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    if (phonePayResponse.data.status === "COMPLETED") {
      transaction.status = "paid";
    } else if (phonePayResponse.data.status === "FAILED") {
      transaction.status = "failed";
    } else {
      transaction.status = "pending";
    }
    transaction.phonePeResponse = JSON.stringify(phonePayResponse);
    await transaction.save();

    res
      .status(200)
      .json({ status: "success", message: "transaction updated successfully" });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.checkPhonepeTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    const { data: phonePayResponse } = await axios.get(
      `${process.env.PHONEPE_PAY_LINK}/status/${process.env.PHONEPE_PAY_MERCHANT_ID}/${id}`
    );
    if (phonePayResponse.data.status === "COMPLETED") {
      transaction.status = "paid";
    } else if (phonePayResponse.data.status === "FAILED") {
      transaction.status = "failed";
    } else {
      transaction.status = "pending";
    }
    await transaction.save();
    res.status(200).json({ status: "success", transaction });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }

    if (transaction.method === "phonepe") {
      try {
        const { data: phonePayResponse } = await axios.get(
          `${process.env.PHONEPE_PAY_LINK}/status/${process.env.PHONEPE_PAY_MERCHANT_ID}/${transaction._id}`
        );
        console.log({ phonePayResponse });
        if (phonePayResponse.data.status === "COMPLETED") {
          transaction.status = "paid";
        } else if (phonePayResponse.data.status === "FAILED") {
          transaction.status = "failed";
        } else {
          transaction.status = "pending";
        }
        await transaction.save();
      } catch (err) {
        console.log(err.message);
      }
    }
    res.status(200).json({ status: "success", transaction });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};
