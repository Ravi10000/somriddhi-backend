const { createHash } = require("crypto");
require("dotenv").config();
function SHA256(payload) {
  return createHash("sha256").update(payload).digest("hex");
}

module.exports = SHA256;

// const saltKey = "e0a4d7c0-5d9d-4e4a-8b1a-5b9b6e4f1c2a";
// const saltIndex = 1;

// console.log(process.env.PHONEPE_PAY_MERCHANT_ID);
// const payload = `/pg/v1/status/${
//   process.env.PHONEPE_PAY_MERCHANT_ID
// }/${"652682267e534f0e5151430f"}${process.env.PHONEPE_PAY_SALT}`;
// console.log({ payload });

// const encoded = SHA256(payload);
// console.log({ encoded });
// console.log(encoded + "###" + saltIndex);
