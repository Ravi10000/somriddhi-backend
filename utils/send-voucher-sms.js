const axios = require("axios");
module.exports.sendVoucherSms = async ({ phone, voucherDetails }) => {
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
      sender: process.env.SMS_VOUCHER_SENDER_ID,
      short_url: "1",
      receiver_name: "",
      sender_name: "",
      ref_id: "",
      gift_card_code: "",
      amount: "",
      validity: "",
      link: "",
    }),
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

`##receiver_name##, "sender_name" has sent you an Amazon Pay E-Gift Card. 
Reference ID - ##ref_id##, 
Gift Card Code - ##gift_card_code##,
 Amount - Rs ##amount##.00, 
Validity - ##validity##. Click ##link## to 
add it to your account. - Team Somriddhi`;
