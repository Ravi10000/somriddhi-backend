const axios = require("axios");
const Transaction = require("../models/Transaction.model");
const { encodeRequest } = require("../utils/encode-request");
const SHA256 = require("../sha256-hash");
const User = require("../models/User");
const moment = require("moment");
const GiftCard = require("../models/GiftCardModel");

exports.createTransaction = async (req, res) => {
  try {
    console.log("initiated transaction");
    console.log({ body: req.body });
    const {
      yesPayResponse: _unauthorisedYesPayResponse,
      phonePeResponse: _unauthorisedPhonePeResponse,
      status: _unauthorisedStatus,
      ...restTransactionData
    } = req.body;

    if (!req.user)
      return res.status(401).json({ status: "error", message: "Unauthorized" });

    // const limit = await checkLimit(req?.user?._id, req?.body?.amount);
    const limit = await checkLimit(
      req?.body?.email,
      req?.body?.amount,
      req.user?._id
    );
    console.log({ limit });
    if (limit?.status === "exceeded")
      return res.status(400).json({
        status: "error",
        message: "limit exceeded",
        flashMessage: limit?.flashMessage,
      });

    const transaction = await Transaction.create({
      ...restTransactionData,
      user: req.user._id,
    });
    console.log({ transaction });
    let redirectUrl = null;
    if (req?.body?.method === "phonepe") {
      const payload = `{
        "merchantId": "${process.env.PHONEPE_PAY_MERCHANT_ID}",
        "merchantTransactionId": "${transaction._id}",
        "merchantUserId": "${req.user._id}",
        "amount": ${parseFloat(req.body.discountedAmount) * 100},
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
    } else if (req?.body?.method === "upigateway") {
      const response = await initiateUPIGatewayTransaction(transaction);
      console.log({ response });
      console.log({ data: response?.data });
      if (!response?.status) {
        return res.status(500).json({
          status: "error",
          message: "internal server error",
        });
      }
      redirectUrl = response?.data?.payment_url;
      console.log({ redirectUrl });
    }
    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction,
      redirectUrl,
    });
  } catch (err) {
    console.log({ error: err.message });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  console.log("update yes pe transaction status");
  try {
    let { response: yesPayResponse } = req.body;
    yesPayResponse = JSON.parse(yesPayResponse);
    console.log({ yesPayResponse });
    console.log({ transactionId: yesPayResponse?.request_id });
    const transaction =
      yesPayResponse?.request_id &&
      (await Transaction.findById(yesPayResponse?.request_id));
    console.log({ transaction });
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    transaction.status =
      yesPayResponse?.transaction_details?.transaction_status?.toLowerCase?.() ||
      "pending";
    transaction.yesPayResponse = JSON.stringify(yesPayResponse);
    await transaction.save();

    res.redirect("https://somriddhi.store/payment-status/" + transaction._id);
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateTransactionPhonepe = async (req, res) => {
  console.log("phonePe transaction status - webhhok");
  try {
    let { response: phonePeResponse } = req.body;
    console.log({ phonePeResponse });
    const transaction = await Transaction.findById(
      phonePeResponse.data.merchantTransactionId
    );
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    transaction = await setStatusPhonePe(phonePeResponse, transaction);
    // if (phonePeResponse.data.status === "COMPLETED") {
    //   transaction.status = "paid";
    // } else if (phonePeResponse.data.status === "FAILED") {
    //   transaction.status = "failed";
    // } else {
    //   transaction.status = "pending";
    // }
    // transaction.phonePeResponse = JSON.stringify(phonePeResponse);
    // await transaction.save();

    res.status(200).json({
      status: "success",
      message: "transaction updated successfully",
    });
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
    const { data: phonePeResponse } = await axios.get(
      `${process.env.PHONEPE_PAY_LINK}/status/${process.env.PHONEPE_PAY_MERCHANT_ID}/${id}`
    );
    if (phonePeResponse.data.status === "COMPLETED") {
      transaction.status = "paid";
    } else if (phonePeResponse.data.status === "FAILED") {
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
    let transaction = await Transaction.findById(req.params.id);
    console.log({ transaction });
    console.log(req?.user?._id);
    if (req?.user?._id !== transaction.user.toString()) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }
    console.log({ transaction });
    console.log({
      status: ["pending, initiated"].includes(transaction?.status),
    });
    if (
      transaction?.method === "phonepe" &&
      (transaction?.status === "pending" || transaction?.status === "initiated")
    ) {
      console.log("checking phone pe payment status");
      transaction = await phonePayStatusUpdate(transaction);
    } else if (
      transaction?.method === "upigateway" &&
      (transaction?.status === "pending" || transaction?.status === "initiated")
    ) {
      const transactionResponse = await checkUPIGatewayTransactionStatus(
        transaction
      );
      console.log({ transactionResponse });
      console.log({ status: transactionResponse?.data?.status });
      if (!transactionResponse?.data?.status)
        return res
          .status(500)
          .json({ status: "error", message: "internal server error" });
      transaction.upigatewayResponse = JSON.stringify(transactionResponse);
      if (transactionResponse?.data?.status === "success") {
        transaction.status = "paid";
      } else if (
        transactionResponse?.data?.status === "failed" ||
        transactionResponse?.data?.status === "failure"
      ) {
        transaction.status = "failed";
      }
      await transaction.save();
    }
    res.status(200).json({ status: "success", transaction });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ status: "error", message: err.message });
  }
};

async function phonePayStatusUpdate(transaction) {
  console.log("checking phone pe payment status function");
  try {
    const { data: phonePeResponse } = await axios.get(
      `${process.env.PHONEPE_PAY_LINK}/status/${process.env.PHONEPE_PAY_MERCHANT_ID}/${transaction._id}`,
      {
        headers: {
          "X-MERCHANT-ID": process.env.PHONEPE_PAY_MERCHANT_ID,
          "X-VERIFY":
            SHA256(
              `/pg/v1/status/${process.env.PHONEPE_PAY_MERCHANT_ID}/${transaction._id}${process.env.PHONEPE_PAY_SALT}`
            ) +
            "###" +
            process.env.PHONEPE_PAY_SALT_INDEX,
        },
      }
    );
    console.log({ phonePeResponse });
    if (!phonePeResponse?.data?.state)
      throw new Error("error while checking phone pe payment status");
    transaction = await setStatusPhonePe(phonePeResponse, transaction);
  } catch (err) {
    console.log({
      "error while checking phone pe payment status": err.message,
    });
  } finally {
    return transaction;
  }
}

async function setStatusPhonePe(phonePeResponse, transaction) {
  if (phonePeResponse?.data) {
    console.log({ phonePeResponse });
    if (phonePeResponse.data.state === "COMPLETED") transaction.status = "paid";
    else if (phonePeResponse.data.state === "FAILED")
      transaction.status = "failed";
    else transaction.status = "pending";

    transaction.phonePeResponse = JSON.stringify(phonePeResponse);
    await transaction.save();
    console.log({ transaction });
  }
  return transaction;
}

async function initiateUPIGatewayTransaction(transaction) {
  const data = JSON.stringify({
    key: process.env.UPIGATEWAY_KEY,
    client_txn_id: transaction?._id,
    amount: transaction?.discountedAmount.toString(),
    p_info: "Amazon Shopping Voucher",
    customer_name: transaction?.firstname + " " + transaction?.lastname,
    customer_email: transaction?.email,
    customer_mobile: transaction?.mobile,
    redirect_url: "https://somriddhi.store/payment-status/" + transaction._id,
  });

  console.log({ requestData: JSON.parse(data) });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.ekqr.in/api/create_order",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    const response = await axios(config);
    console.log({ response: response.data });
    return response?.data || null;
  } catch (err) {
    console.error({ error: err.message });
    return null;
  }
}

async function checkUPIGatewayTransactionStatus(transaction) {
  try {
    const data = JSON.stringify({
      key: process.env.UPIGATEWAY_KEY,
      client_txn_id: transaction?._id,
      txn_date: moment(transaction.createdAt).format("DD-MM-YYYY"),
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.ekqr.in/api/check_order_status",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };
    const response = await axios(config);
    console.log({ response: response?.data });
    return response?.data || null;
  } catch (err) {
    console.log({ error: err.message });
    return null;
  }
}

async function checkLimit(email, amount) {
  const today = moment();
  // const startOfWeek = moment().startOf("week");
  const startOfMonth = moment().startOf("month");
  // const weeklyTransactions = await Transaction.find({
  //   // user: userId,
  //   email,
  //   status: "paid",
  //   createdAt: {
  //     $gte: new Date(new Date(startOfWeek).setHours("00", "00", "00")),
  //     $lte: new Date(new Date(today).setHours("23", "59", "59")),
  //   },
  // });
  // const weeklyExpense = calculateExpense(weeklyTransactions);
  // if (weeklyExpense + amount > 10_000) {
  //   return {
  //     status: "exceeded",
  //     flashMessage: "Weekly Limit of ₹10,000 Reached.",
  //   };
  // }
  const monthlyTransactions = await Transaction.find({
    // user: userId,
    email,
    status: "paid",
    createdAt: {
      // $gte: startOfMonth,
      // $lte: today,
      $gte: new Date(new Date(startOfMonth).setHours("00", "00", "00")),
      $lte: new Date(new Date(today).setHours("23", "59", "59")),
    },
  });

  const monthlyExpense = calculateExpense(monthlyTransactions);
  // TODO: check user entity and set limit accordingly (20k for individual, 50k for business)
  // FIXME: entity is set on user, but we are checking limit on email how to we get entity type of user if limit is set based on email
  const limits = {
    individual: 30_000,
    business: 50_000,
    default: 30_000,
  };
  if (monthlyExpense + amount > 30_000) {
    return {
      status: "exceeded",
      flashMessage: "Monthly Limit of ₹30,000 Reached.",
    };
  }
  return { status: "not-exceeded" };
}

function calculateExpense(transactions) {
  return transactions.reduce(
    (acc, transaction) => acc + transaction?.amount,
    0
  );
}
