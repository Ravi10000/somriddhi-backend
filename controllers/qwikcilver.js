require("dotenv").config();
const GiftCard = require("../models/GiftCardModel");
const axios = require("axios");
const cryptoJS = require("crypto-js");
const moment = require("moment");
const fs = require("fs");
const Razorpay = require("razorpay");
const path = require("path");
const User = require("../models/User");
const Transaction = require("../models/Transaction.model");

const categoryUrl = "https://extapi12.woohoo.in/rest/v3/catalog/categories";
//const productUrl = "https://extapi12.woohoo.in/rest/v3/catalog/categories/330/products/";
const productUrl = "https://extapi12.woohoo.in/rest/v3/catalog/products/";
const orderUrl = "https://extapi12.woohoo.in/rest/v3/orders";
const activatedCardUrl = "https://extapi12.woohoo.in/rest/v3/order/";
const statusUrl = "https://extapi12.woohoo.in/rest/v3/order/";

const productListFilePath = path.resolve("productList.txt"); // $ROOT_FOLDER/productList.txt
console.log("productsListURl : ", path.resolve("productList.txt"));
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

exports.addGiftCardOrder = async (req, res) => {
  console.log("addGiftCardOrder ", req.body);
  const { transactionId } = req.body;
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(400).json({
      status: "Fail",
      message: "Transaction not found",
    });
  }

  // const { address, billingAddress, totalAmount, unitPrice, qty, paymentid } =
  //   req.body;

  // const {
  //   amount,
  //   unitPrice,
  //   quantity,
  //   email,
  //   mobile,
  //   firstname,
  //   lastname,
  //   line1,
  //   line2,
  //   district,
  //   state,
  //   postcode,
  //   yesPayResponse,
  //   phonePeResponse,
  //   status,
  //   method,
  // } = transaction;

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

  if (!transactionResponse || !paymentid) {
    return res.status(400).json({
      status: "Fail",
      message: "no response found for this transaction",
    });
  }

  try {
    // //create a gift card model document
    var refno = "SOMRIDDHI" + Date.now();
    console.log({ refno });

    var createOrderBody = {
      // address: address,
      address: {
        firstname: transaction?.firstname,
        ...(transaction?.lastname && { lastname: transaction?.lastname }),
        email: transaction?.email,
        telephone: "+91" + transaction?.mobile,
        line1: transaction?.line1,
        ...(transaction?.line2 && { line2: transaction?.line2 }),
        city: transaction?.district,
        region: transaction?.state,
        country: "IN",
        postcode: transaction?.postcode,
        billToThis: true,
      },
      // billing: billingAddress,
      payments: [
        {
          code: "svc",
          amount: parseInt(transaction?.amount),
          poNumber: paymentid,
        },
      ],
      products: {
        sku: process.env.QWIK_PRODID,
        // sku: "APITESTTIMFAIL",
        price: parseInt(transaction?.unitPrice),
        qty: parseInt(transaction?.quantity),
        currency: 356,
      },
      // products: [
      //   {
      //     sku: process.env.QWIK_PRODID,
      //     // sku: "APITESTTIMFAIL",
      //     price: parseInt(transaction?.unitPrice),
      //     qty: parseInt(transaction?.quantity),
      //     currency: 356,
      //   },
      // ],
      deliveryMode: "API",
      refno,
      syncOnly: true,
    };

    console.log({ createOrderBody });

    const source = axios.CancelToken.source();
    const timeout = setTimeout(async () => {
      console.log("timeout errr");
      var orderStatusResponse;

      console.log("Status call 1");
      var orderStatusOptions = {
        method: "GET",
        url: statusUrl + refno + "/status",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + req.access_token,
          signature: cryptoJS
            .HmacSHA512(
              getConcatenateBaseString(
                statusUrl + refno + "/status",
                null,
                "GET"
              ),
              process.env.QWIK_CLIENTSECRET
            )
            .toString(),
          dateAtClient: moment().toISOString(),
        },
      };

      orderStatusResponse = await axios.request(orderStatusOptions);
      console.log(orderStatusResponse.data);

      if (orderStatusResponse.data["status"] != "COMPLETE") {
        console.log("Status call 2");
        await delay(15000);

        var orderStatusOptions = {
          method: "GET",
          url: statusUrl + refno + "/status",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + req.access_token,
            signature: cryptoJS
              .HmacSHA512(
                getConcatenateBaseString(
                  statusUrl + refno + "/status",
                  null,
                  "GET"
                ),
                process.env.QWIK_CLIENTSECRET
              )
              .toString(),
            dateAtClient: moment().toISOString(),
          },
        };

        orderStatusResponse = await axios.request(orderStatusOptions);
        console.log({ orderStatusResponseData: orderStatusResponse.data });

        if (orderStatusResponse.data["status"] != "COMPLETE") {
          console.log("Status call 3");
          await delay(15000);

          var orderStatusOptions = {
            method: "GET",
            url: statusUrl + refno + "/status",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + req.access_token,
              signature: cryptoJS
                .HmacSHA512(
                  getConcatenateBaseString(
                    statusUrl + refno + "/status",
                    null,
                    "GET"
                  ),
                  process.env.QWIK_CLIENTSECRET
                )
                .toString(),
              dateAtClient: moment().toISOString(),
            },
          };

          orderStatusResponse = await axios.request(orderStatusOptions);
          console.log({ orderStatusResponseData: orderStatusResponse.data });
          if (orderStatusResponse.data["status"] != "COMPLETE") {
            source.cancel();
            var instance = new Razorpay({
              key_id: process.env.RAZOR_PAY_KEY_ID,
              key_secret: process.env.RAZOR_PAY_KEY_SECRET,
            });
            var refundResponse = await instance.payments.refund(paymentid, {
              amount: totalAmount,
              speed: "normal",
            });
            console.log(refundResponse);
          } else if (orderStatusResponse.data["status"] == "COMPLETE") {
            console.log("Completed after call 3");
            //todo
            var _url =
              activatedCardUrl + orderStatusResponse.data["orderId"] + "/cards";
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
            var activatedCardResponse = await axios.request(
              activatedCardOptions
            );
            console.log({ activatedCardResponse });
            const giftCard = {
              requestBody: JSON.stringify(createOrderBody),
              totalAmount: totalAmount,
              unitPrice: unitPrice,
              qty: qty,
              refno: refno,
              orderId: createOrderResponse.data["orderId"],
              activatedCardRes: JSON.stringify(activatedCardResponse.data),
              status: createOrderResponse.data["status"],
              createdBy: req.user._id,
            };
            console.log({ giftCard });
            const giftCardObj = await GiftCard.create(giftCard);
            const user = await User.findById(req.user._id);

            // TODO: extract voucher details from activatedCardResponse.data
            // TODO: send sms
            // await sendVoucherSms(user.phone, activatedCardResponse.data);

            // TODO: send email
            // TODO: extract voucher card no, amount and user name to send email
            // await sendVoucherEmail(user.email /* voucher details */);

            res.status(200).json({
              status: "Success",
              message: "Order Generated Successfully",
              data: giftCardObj,
            });
          }
        } else if (orderStatusResponse.data["status"] == "COMPLETE") {
          console.log("Completed after call 2");
          //todo
          var _url =
            activatedCardUrl + orderStatusResponse.data["orderId"] + "/cards";
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
          const giftCard = {
            requestBody: JSON.stringify(createOrderBody),
            totalAmount: totalAmount,
            unitPrice: unitPrice,
            qty: qty,
            refno: refno,
            orderId: createOrderResponse.data["orderId"],
            activatedCardRes: JSON.stringify(activatedCardResponse.data),
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
        }
      } else if (orderStatusResponse.data["status"] == "COMPLETE") {
        console.log("Completed after call 1");
        //todo
        var _url =
          activatedCardUrl + orderStatusResponse.data["orderId"] + "/cards";
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
        const giftCard = {
          requestBody: JSON.stringify(createOrderBody),
          totalAmount: totalAmount,
          unitPrice: unitPrice,
          qty: qty,
          refno: refno,
          orderId: createOrderResponse.data["orderId"],
          activatedCardRes: JSON.stringify(activatedCardResponse.data),
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
      // data: createOrderBody,
    };

    console.log({ createOrderOptions });

    var createOrderResponse = await axios.request(createOrderOptions);
    clearTimeout(timeout);
    console.log({ createOrderResponseData: createOrderResponse?.data });

    if (createOrderResponse.data["status"] == "COMPLETE") {
      //insert in db
      console.log("completed naturally");
      var _url =
        activatedCardUrl + createOrderResponse.data["orderId"] + "/cards";
      console.log({ _url });
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
      const giftCard = {
        requestBody: JSON.stringify(createOrderBody),
        totalAmount: totalAmount,
        unitPrice: unitPrice,
        qty: qty,
        refno: refno,
        orderId: createOrderResponse.data["orderId"],
        activatedCardRes: JSON.stringify(activatedCardResponse.data),
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
    } else {
      var instance = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_KEY_SECRET,
      });
      var refundResponse = await instance.payments.refund(paymentid, {
        amount: totalAmount,
        speed: "normal",
      });
      res.status(400).json({
        status: "Fail",
        message:
          "An error occured while purchasing giftcard. Your amount will be refunded withing 5-10 business days",
      });
    }
  } catch (err) {
    if (err.message == "canceled") {
      res.status(400).json({
        status: "Fail",
        message:
          "An error occured while purchasing giftcard. Your amount will be refunded withing 5-10 business days",
      });
    } else {
      console.log({ error: err.message });
      res.status(400).json({
        status: "Fail",
        message: err.message,
      });
    }
  }
};

exports.getGiftCards = async (req, res) => {
  fs.readFile(productListFilePath, "utf8", async function (err, data) {
    console.log(productListFilePath, data);
    //console.log("data ",data);
    if (err) console.log(err);
    else if (data) {
      return res.status(200).json({
        status: "Success",
        data: JSON.parse(data),
      });
    }
    try {
      /* 
console.log(productUrl);
      const categoryOptions = {
        method: "GET",
        url: productUrl,
        headers: {
          Authorization: "Bearer " + req.access_token,
          signature: cryptoJS
            .HmacSHA512(
              getConcatenateBaseString(
                productUrl,
                null,
                "GET"
              ),
              process.env.QWIK_CLIENTSECRET
            )
            .toString(),
          dateAtClient: moment().toISOString(),
        },
      };
      var categoryResponse = await axios.request(categoryOptions);
      console.log("Categories: ",categoryResponse.data);
*/

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
      console.log("PRODUCT RESPONSE : ", productResponse.data);
      fs.writeFile(
        productListFilePath,
        JSON.stringify(productResponse.data),
        function (err) {
          console.log("Error while saving file: ", err);
        }
      );

      return res.status(200).json({
        status: "Success",
        data: productResponse.data,
      });
    } catch (err) {
      res.status(400).json({
        status: "Fail",
        message: err.message,
      });
    }
  });
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
    const myOrders = await GiftCard.findOne({ orderId: req?.params?.orderid });

    // var _url = activatedCardUrl + req?.params?.orderid + "/cards";
    // console.log(_url);
    // const activatedCardOptions = {
    //   method: "GET",
    //   url: _url,
    //   headers: {
    //     Authorization: "Bearer " + req.access_token,
    //     signature: cryptoJS
    //       .HmacSHA512(
    //         getConcatenateBaseString(_url, null, "GET"),
    //         process.env.QWIK_CLIENTSECRET
    //       )
    //       .toString(),
    //     dateAtClient: moment().toISOString(),
    //   },
    // };
    // var activatedCardResponse = await axios.request(activatedCardOptions);

    res.status(200).json({
      status: "success",
      message: "All orders fetched",
      activatedCards: JSON.parse(myOrders.activatedCardRes),
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
      giftCards,
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
