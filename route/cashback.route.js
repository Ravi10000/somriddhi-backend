const express = require("express");
const {
  //   generateCashback,
  getCashbackDetails,
} = require("../controllers/cashback.controller");
const { fetchuser } = require("../middleware/auth");

const router = express.Router();

router.get("/cashback", fetchuser, getCashbackDetails);
// router.post("/cashback", fetchuser, generateCashback);

module.exports = router;
