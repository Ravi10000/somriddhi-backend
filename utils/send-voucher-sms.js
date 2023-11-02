const axios = require("axios");
require("dotenv").config();
module.exports.sendVoucherSms = async (phone, voucherDetails) => {
  console.log({ phone, voucherDetails });
  if (!voucherDetails?.senderName) voucherDetails.senderName = "Somriddhi";
  console.log({ voucherDetails });
  const options = {
    method: "POST",
    url: process.env.SMS_URL,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authkey: process.env.SMS_AUTH_KEY, // TODO: check with template
    },
    data: JSON.stringify({
      template_id: process.env.SMS_VOUCHER_TEMPLATE_ID, // TODO: check with template
      mobiles: "91" + phone,
      short_url: "1",
      sender: process.env.SMS_VOUCHER_SENDER_ID,
      var: voucherDetails?.voucherCode, //voucher code
      var1: voucherDetails?.senderName, //sender name
      var2: voucherDetails?.orderId, // ref id / no
      var3: voucherDetails?.amount, // amount
      var4: "https://www.amazon.in/vouchers",
      // var4: `https://www.amazon.in/apay-products/apv/landing?voucherCode=${voucherDetails?.voucherCode}`, // link
    }),
    // var2: voucherDetails?.giftCardId, // ref id / no
  };
  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

// ##var1## has sent you a Amazon Shopping Voucher. Ref ID - ##var2##, SVC Code - ##var##, Amount - Rs##var3##, . Click link ##var4## to access your purchased vouchers - Team somriddhi.store -SOMRIDDHI
