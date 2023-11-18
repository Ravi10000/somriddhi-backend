const { createTransport } = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
require("dotenv").config();

async function sendResetPasswordLink(to, link) {
  const transporter = createTransport({
    host: process.env.SMTP_HOST, // TODO: add emailer creds in env
    // port: 587,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
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
    from: `Somriddhi.store <password reset email>`,
    to,
    subject: `Click on below link to reset your password`,
    template: "reset-password",
    context: { link }, // voucherCode, amount, name, validity, giftCardId
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = sendResetPasswordLink;
