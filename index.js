const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

env.config();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://somriddhi.store');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static("uploads"));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
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

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT} `);
});
