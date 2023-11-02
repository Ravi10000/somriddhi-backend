const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  newUser,
  updateUser,
  getAllUsers,
  getRefferedUsers,
  changeWalletId,
} = require("../controllers/Otp");

const {
  getGiftCards,
  addGiftCardOrder,
  getActivatedCards,
  getMyCards,
  getAllGiftCards,
} = require("../controllers/qwikcilver");
const { fetchuser, isAdmin } = require("../middleware/Auth");
const { generateAccessToken } = require("../middleware/Qwik");

router.post("/user/walletId", fetchuser, changeWalletId);
router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/user", fetchuser, newUser);
router.patch("/user", fetchuser, updateUser);
router.get("/user", fetchuser, isAdmin, getAllUsers);
router.get("/user/referred", fetchuser, getRefferedUsers);

router.post(
  "/addgiftcards",
  fetchuser,
  generateAccessToken,
  addGiftCardOrder,
  generateAccessToken,
  addGiftCardOrder
);
router.get("/getgiftcards", generateAccessToken, getGiftCards);
router.get("/getmygiftcards", fetchuser, getMyCards);
router.get("/getallgiftcards", fetchuser, isAdmin, getAllGiftCards);
router.get(
  "/getActivatedCards/:orderid",
  fetchuser,
  // generateAccessToken,
  getActivatedCards
);

module.exports = router;
