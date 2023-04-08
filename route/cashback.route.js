const express = require("express");
const {
  //   generateCashback,
  getCashbackDetails,
  fetchRedeemableCashbacks,
  redeemCashback,
} = require("../controllers/cashback.controller");
const { fetchuser } = require("../middleware/Auth");

const router = express.Router();

router.get("/cashback/redeemable", fetchuser, fetchRedeemableCashbacks);
router.get("/cashback", fetchuser, getCashbackDetails);
router.post("/cashback/redeem", fetchuser, redeemCashback);

module.exports = router;
