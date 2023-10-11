const { default: axios } = require("axios");

async function orderGiftCard(orderStatusOptions) {
  const orderStatusResponse = await axios.request(orderStatusOptions);
}

module.exports.addGiftCardOrder = async (req, res) => {
  const { address, billingAddress, totalAmount, unitPrice, qty, paymentid } =
    req.body;
  let refno = "SOMRIDDHI" + Date.now();
  const createOrderBody = {
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
        sku: process.env.QWIK_PRODID,
        price: unitPrice,
        qty: qty,
        currency: 356,
      },
    ],
    deliveryMode: "API",
    refno,
    syncOnly: true,
  };
  const orderStatusOptions = {
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
    },
  };
  const source = axios.CancelToken.source();
  const timeout = setTimeout(async () => {
    let orderStatusResponse;
    orderStatusResponse = await axios.request(orderStatusOptions);
  }, 10_000);
  try {
  } catch (err) {
    if (err.message == "cancelled") {
      res.status(400).json({
        status: "Fail",
        message:
          "An error occured while purchasing giftcard. Your amount will be refunded withing 5-10 business days",
      });
    } else {
      console.log(err);
      res.status(400).json({
        status: "Fail",
        message: err.message,
      });
    }
  }
};
