const { createTransport } = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();
// console.log(path.resolve(path.dirname(__dirname), "views"));
console.log(process.env.SMTP_HOST);
console.log(process.env.SMTP_USERNAME);
console.log(process.env.SMTP_PASSWORD);
async function sendVoucherEmail(to, voucherDetails) {
  const transporter = createTransport({
    host: process.env.SMTP_HOST, // TODO: add emailer creds in env
    // port: 587,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  //   const transporter = createTransport({
  //     host: 'smtp.ethereal.email',
  //     port: 587,
  //     auth: {
  //         user: 'robb.heathcote54@ethereal.email',
  //         pass: 'nAdwY3vHJpAcuDh987'
  //     }
  // });
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve(path.dirname(__dirname), "views", "partials"),
      defaultLayout: false,
    },
    viewPath: path.resolve(path.dirname(__dirname), "views"),
    extName: ".hbs",
  };
  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `Somriddhi.store <giftcard.order@somriddhidigital.com>`,
    to,
    subject: `Dear ${voucherDetails?.name} here is your Rs ${voucherDetails?.amount} Amazon Shopping Voucher`,
    template: "voucher-template-2",
    context: voucherDetails, // voucherCode, amount, name, validity, giftCardId
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = sendVoucherEmail;
