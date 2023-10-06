const { createTransport } = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();
// console.log(path.resolve(path.dirname(__dirname), "views"));
console.log(process.env.ASSESTS_BASE_URL);
console.log({ assestsBaseUrl: process.env.ASSESTS_BASE_URL });

async function sendVoucherEmail(to, voucherDetails) {
  //   const transporter = createTransport({
  //     host: process.env.EMAIL_HOST, // TODO: add emailer creds in env
  //     // port: 587,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //   });
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "sale.mr.phonex@gmail.com",
      pass: "ysnmjiqskhlhirho",
    },
  });
  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebar",
      partialsDir: path.resolve(path.dirname(__dirname), "views", "partials"),
      defaultLayout: false,
    },
    viewPath: path.resolve(path.dirname(__dirname), "views"),
    extName: ".handlebar",
  };
  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `voucher details`,
    to,
    subject: "Voucher Details",
    template: "voucher-template",
    context: {
      ...voucherDetails,
      assestsBaseUrl: process.env.ASSESTS_BASE_URL,
    }, // cardNo, amount, name
  };

  return await transporter.sendMail(mailOptions);
  // transporter.sendMail(mailOptions, (error, info) => {
  //   error && console.log({ error });
  //   info && console.log({ info });
  // });
}

module.exports = sendVoucherEmail;
