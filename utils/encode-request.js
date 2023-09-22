const { createHash } = require("crypto");
const base64 = require("base-64");

const encodeRequest = (payload) => {
  const encodedPayload = base64.encode(payload);
  const hash = createHash("sha256").update(encodedPayload + "/pg/v1/pay" + process.env.PHONEPE_PAY_SALT).digest("hex");
  return { encodedPayload, hash };
};

module.exports.encodeRequest = encodeRequest;
