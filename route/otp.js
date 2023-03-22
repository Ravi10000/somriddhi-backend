const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  newUser,
  updateUser,
  getAllUsers,
} = require("../controllers/Otp");
const { fetchuser } = require("../middleware/Auth");

router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/user", fetchuser, newUser);
router.patch("/user", fetchuser, updateUser);
router.get("/user", fetchuser, getAllUsers);

module.exports = router;
