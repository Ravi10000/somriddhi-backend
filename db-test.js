const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

const moment = require("moment");
const Transaction = require("./models/Transaction.model");

async function testLimit() {
  const today = moment("2023-11-02");
  const startOfWeek = today.startOf("week");
  console.log({ today, startOfWeek });

  const transactions = await Transaction.find({
    user: "642cf4aefd8b7a0586d83802",
    status: "paid",
    createdAt: {
      $gte: startOfWeek,
      $lte: today,
    },
  });
  console.log({ transactions });
}

testLimit();
