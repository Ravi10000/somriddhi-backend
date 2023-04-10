const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  newUser,
  updateUser,
  getAllUsers,
  getRefferedUsers,
} = require("../controllers/Otp");
const { fetchuser, isAdmin } = require("../middleware/Auth");

router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/user", fetchuser, newUser);
router.patch("/user", fetchuser, updateUser);
router.get("/user", fetchuser, isAdmin, getAllUsers);
router.get("/user/referred", fetchuser, getRefferedUsers);

module.exports = router;
