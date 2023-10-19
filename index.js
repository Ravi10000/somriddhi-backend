require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const { engine } = require("express-handlebars");
const path = require("path");
const sendVoucherEmail = require("./utils/send-voucher-email");
const { sendVoucherSms } = require("./utils/send-voucher-sms");

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

var privateKey = fs.readFileSync("api_somriddhi_store.key", "utf8");
var certificate = fs.readFileSync("api_somriddhi_store.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };

app.engine("hbs", engine());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("welcome to somriddhi store api");
});

app.get("/test-hbs", async (req, res) => {
  try {
    const emailResponse = await sendVoucherEmail("ravisince2k@gmail.com", {
      name: "Ravi Sharma",
      giftCardId: "6524e480b36fedcb858b64bd",
      voucherCode: "SVAQ-TMDRD9-Z9M",
      amount: "1000",
      validity: "2024/10/05",
      orderId: "6524e47db36fedcb858b64bb",
    });
    console.log({ emailResponse });
    res.render("voucher-template", {
      layout: false,
      name: "Ravi Sharma",
      giftCardId: "6524e480b36fedcb858b64bd",
      voucherCode: "SVAQ-TMDRD9-Z9M",
      amount: "1000",
      validity: "2024/10/05",
      orderId: "6524e47db36fedcb858b64bb",
    });
  } catch (err) {
    console.log("failed to send email");
    console.log({ error: err.message });
    res.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/test-email-template", async (req, res) => {
  // try {
  //   const emailResponse = await sendVoucherEmail("ravisince2k@gmail.com", {
  //     // layout: false,
  //     name: "Ravi Sharma",
  //     giftCardId: "6524e480b36fedcb858b64bd",
  //     voucherCode: "SVAQ-TMDRD9-Z9D",
  //     amount: "1000",
  //     senderName: "Rocky Sharma",
  //     validity: "2024/10/05",
  //     orderId: "6524e47db36fedcb858b64bb",
  //   });
  //   console.log({ emailResponse });
  // } catch (err) {
  //   console.error(err.message);
  // }
  res.render("voucher-template-2", {
    layout: false,
    name: "Ravi Sharma",
    giftCardId: "6524e480b36fedcb858b64bd",
    voucherCode: "SVAQ-TMDRD9-Z9D",
    amount: "1000",
    senderName: "Rocky Sharma",
    validity: "2024/10/05",
    orderId: "6524e47db36fedcb858b64bb",
  });
});

app.get("/test-sms", async (req, res) => {
  try {
    const response = await sendVoucherSms("9560863067", {
      voucherCode: "SVAQ-TMDRD9-Z9D",
      // senderName: "Ravi",
      amount: "100",
      refId: "123456",
      link: "https://somriddhi.store",
    });
    console.log({ response });
    res.status(200).json({
      status: "success",
      message: "sms sent successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: "error",
      message: "sms failed",
      error: err.message,
    });
    // res.send("sms failed");
  }
});

app.use(cors());
app.use("/api", require("./route/cashback.route"));
app.use("/api", require("./route/auth"));
app.use("/api", require("./route/search"));
app.use("/api", require("./route/content"));
app.use("/api", require("./route/otp"));
app.use("/api", require("./route/banner"));
app.use("/api", require("./route/category"));
app.use("/api", require("./route/deal"));
app.use("/api", require("./route/faq"));
app.use("/api", require("./route/feedback"));
app.use("/api", require("./route/membership"));
app.use("/api", require("./route/newsletter"));
app.use("/api", require("./route/ticket"));
app.use("/api", require("./route/analytic"));
app.use("/api", require("./route/payment"));
app.use("/api", require("./route/transaction.route"));
app.use("/api", require("./route/phone-pe.route"));
app.use("/api", require("./route/sent-giftcard.route"));

mongoose.connect(process.env.MONGO_URL);

// app.listen(process.env.PORT, () => {
//   console.log(`Server is listening on port ${process.env.PORT} `);
// });

// https.createServer(options, function (req, res) {
//   res.writeHead(200);
//   res.end("Welcome to Node.js HTTPS Servern");
// }).listen(8443);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.HTTP_PORT, () => {
  console.log(`HTTP Server is listening on port ${process.env.HTTP_PORT} `);
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
  console.log(`HTTPS Server is listening on port ${process.env.HTTPS_PORT} `);
});
