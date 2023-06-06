require("dotenv").config();
const GiftCard = require("../models/GiftCardModel");
const axios = require("axios");
const cryptoJS = require("crypto-js");
const moment = require("moment");
const fs = require("fs");
const Razorpay = require('razorpay');

// const categoryUrl = "https://sandbox.woohoo.in/rest/v3/catalog/categories";
const productUrl = "https://sandbox.woohoo.in/rest/v3/catalog/products/";
const orderUrl = "https://sandbox.woohoo.in/rest/v3/orders";
const activatedCardUrl = "https://sandbox.woohoo.in/rest/v3/order/";
const statusUrl = "https://sandbox.woohoo.in/rest/v3/order/";

exports.addGiftCardOrder = async (req, res) => {
  // console.log("sendotp ", req.body);

  const { address, billingAddress, totalAmount, unitPrice, qty, paymentid } =
    req.body;

  try {
    // //create a gift card model document
    var refno = "SOMRIDDHI" + Date.now();
    console.log(refno);

    var createOrderBody = {
      address: address,
      billing: billingAddress,
      payments: [
        {
          code: "svc",
          amount: totalAmount,
          poNumber: paymentid,
        },
      ],
      products: [
        {
          // sku: process.env.QWIK_PRODID,
          sku: "APITESTTIMFAIL",
          price: unitPrice,
          qty: qty,
          currency: 356,
        },
      ], 
      deliveryMode: "API",
      refno: refno,
      syncOnly: true
    };

    console.log(createOrderBody);

    const source = axios.CancelToken.source();
    const timeout = setTimeout(async() => {
      console.log("timeout errr");

      var orderStatusOptions = {
        method: "GET",
        url: statusUrl + refno + "/status",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + req.access_token,
          signature: cryptoJS
            .HmacSHA512(
              getConcatenateBaseString(statusUrl + refno + "/status", null, "GET"),
              process.env.QWIK_CLIENTSECRET
            )
            .toString(),
          dateAtClient: moment().toISOString(),
        }
      };

      var orderStatusResponse = await axios.request(orderStatusOptions);

      console.log(orderStatusResponse);

      if(orderStatusResponse.data['status'] != "COMPLETE"){

        source.cancel();
        var instance = new Razorpay({ key_id: process.env.RAZOR_PAY_KEY_ID, key_secret:  process.env.RAZOR_PAY_KEY_SECRET })
        var refundResponse = await instance.payments.refund(paymentid,{
          "amount": totalAmount,
          "speed": "normal"
        });

        console.log(refundResponse);
      }

    }, 10000);

    var createOrderOptions = {
      method: "POST",
      url: orderUrl,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + req.access_token,
        signature: cryptoJS
          .HmacSHA512(
            getConcatenateBaseString(orderUrl, createOrderBody, "POST"),
            process.env.QWIK_CLIENTSECRET
          )
          .toString(),
        dateAtClient: moment().toISOString(),
      },
      cancelToken: source.token,
      data: JSON.stringify(createOrderBody),
    };

    console.log(createOrderOptions);


    var createOrderResponse = await axios.request(createOrderOptions);
    clearTimeout(timeout);
    console.log(createOrderResponse.data);

    //insert in db
    const giftCard = {
      requestBody: JSON.stringify(createOrderBody),
      totalAmount: totalAmount,
      unitPrice: unitPrice,
      qty: qty,
      refno: refno,
      orderId: createOrderResponse.data["orderId"],
      status: createOrderResponse.data["status"],
      createdBy: req.user._id,
    };
    console.log(giftCard);
    const giftCardObj = await GiftCard.create(giftCard);

    res.status(200).json({
      status: "Success",
      message: "Order Generared Successfully",
      data: giftCardObj,
    });
  } catch (err) {
    if(err.message == "canceled"){
       res.status(400).json({
        status: "Fail",
        message: "An error occured while purchasing giftcard. Your amount will be refunded withing 5-10 business days",
      });
    }
    else if(err.data['code'] == "401"){
      //todo
      res.status(400).json({
        status: "Fail",
        message: "err.message",
      });
    }
    else{
      res.status(400).json({
        status: "Fail",
        message: err.message,
      });
    }
  }
};

exports.getGiftCards = async (req, res) => {
  try {
    const productOptions = {
      method: "GET",
      url: productUrl + process.env.QWIK_PRODID,
      headers: {
        Authorization: "Bearer " + req.access_token,
        signature: cryptoJS
          .HmacSHA512(
            getConcatenateBaseString(
              productUrl + process.env.QWIK_PRODID,
              null,
              "GET"
            ),
            process.env.QWIK_CLIENTSECRET
          )
          .toString(),
        dateAtClient: moment().toISOString(),
      },
    };
    var productResponse = await axios.request(productOptions);
    console.log(productResponse.data);

    res.status(200).json({
      status: "Success",
      data: productResponse.data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getMyCards = async (req, res) => {
  try {
    const myOrders = await GiftCard.find({ createdBy: req.user._id });
    res.status(200).json({
      status: "success",
      message: "All orders fetched",
      myOrders: myOrders,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getActivatedCards = async (req, res) => {
  try {
    var _url = activatedCardUrl + req?.params?.orderid + "/cards";
    console.log(_url);
    const activatedCardOptions = {
      method: "GET",
      url: _url,
      headers: {
        Authorization: "Bearer " + req.access_token,
        signature: cryptoJS
          .HmacSHA512(
            getConcatenateBaseString(_url, null, "GET"),
            process.env.QWIK_CLIENTSECRET
          )
          .toString(),
        dateAtClient: moment().toISOString(),
      },
    };
    var activatedCardResponse = await axios.request(activatedCardOptions);

    res.status(200).json({
      status: "success",
      message: "All orders fetched",
      activatedCards: activatedCardResponse.data,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getAllGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find();
    res.status(200).json({
      status: "success",
      message: "All orders fetched",
      giftCards: giftCards,
    });
  } catch (err) {
    console.log(err);
  }
};

let sortObject = (object) => {
  if (object instanceof Array) {
    var sortedObj = [],
      keys = Object.keys(object);
  } else {
    (sortedObj = {}), (keys = Object.keys(object));
  }

  keys.sort(function (key1, key2) {
    if (key1 < key2) return -1;
    if (key1 > key2) return 1;
    return 0;
  });

  for (var index in keys) {
    var key = keys[index];
    if (typeof object[key] == "object") {
      if (object[key] instanceof Array) {
        sortedObj[key] = sortObject(object[key]);
      }
      sortedObj[key] = sortObject(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  }
  return sortedObj;
};

/**
 * Sort all query parameters in the request according to the parameter name in ASCII table.
 */
let sortQueryParams = (absApiUrl) => {
  var url = absApiUrl.split("?"),
    baseUrl = url[0],
    queryParam = url[1].split("&");

  absApiUrl = baseUrl + "?" + queryParam.sort().join("&");

  return fixedEncodeURIComponent(absApiUrl);
};

/**
 * Concat the (request method(upper case), request host, request URL), encoded request parameters and encoded query parameters using & as the separator.
 */
let getConcatenateBaseString = (absApiUrl, requestBody, requestHttpMethod) => {
  // console.log(absApiUrl,requestBody,requestHttpMethod)
  var baseArray = [];
  baseArray.push(requestHttpMethod.toUpperCase());

  if (absApiUrl.indexOf("?") >= 0) {
    baseArray.push(sortQueryParams(absApiUrl));
  } else {
    baseArray.push(fixedEncodeURIComponent(absApiUrl));
  }
  if (requestBody) {
    baseArray.push(
      fixedEncodeURIComponent(JSON.stringify(sortObject(requestBody)))
    );
  }
  // console.log(baseArray.join('&'));
  return baseArray.join("&");
};

let fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
};
