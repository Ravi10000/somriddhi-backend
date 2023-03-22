const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;

env.config();

app.use(express.static("uploads"));
// app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use("/api", require("./route/auth"));
app.use("/api", require("./route/otp"));
app.use("/api", require("./route/banner"));
app.use("/api", require("./route/category"));
app.use("/api", require("./route/deal"));
app.use("/api", require("./route/faq"));
app.use("/api", require("./route/feedback"));
app.use("/api", require("./route/membership"));
app.use("/api", require("./route/newsletter"));
app.use("/api", require("./route/ticket"));

mongoose.connect(process.env.MONGO_URL);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT} `);
});
