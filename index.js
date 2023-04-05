const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const https = require("https");
const http = require("http");
var fs = require("fs");

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

env.config();

var privateKey = fs.readFileSync("api_somriddhi_store.key", "utf8");
var certificate = fs.readFileSync("api_somriddhi_store.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };

app.use(express.static("uploads"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use("/api", require("./route/cashback.route"));
app.use("/api", require("./route/auth"));
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
