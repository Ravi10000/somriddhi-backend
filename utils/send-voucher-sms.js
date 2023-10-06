const axios = require("axios");

module.exports.sendVoucherSms = async ({ phone, voucherDetails }) => {
  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/flow/",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authkey: "165254AJVmMEYMU60657de6P1", // TODO: check with template
    },
    data: JSON.stringify({
      template_id: "640049b6d6fc050d3e0772d3", // TODO: check with template
      mobiles: "91" + phone,
      sender: "SMRDHI",
      short_url: "1",
      var1: voucherDetails, // TODO: check with template
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
