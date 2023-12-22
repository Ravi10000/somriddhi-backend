const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const { fetchuser } = require("../middleware/Auth");

const {
  deleteUser,
  updateUser,
  getAllUser,
  getUser,
  logout,
  checkAuthentication,
  createUserByAdmin,
  verifyPan,
} = require("../controllers/User");
const otpController = require("../controllers/Otp");
const validateReq = require("../middleware/validate-req");

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
// router.post("/signup", [
//   body('fname', 'Enter a valid name').isLength({ min: 3 }),
//   body('email', 'Enter a valid email').isEmail(),
//   body('phone', 'Enter a valid phone').isLength({ min: 10, max: 15}).isNumeric(),
//   body('usertype', 'Enter a valid usertype').notEmpty(),
//   body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
// ], signup);

// router.post("/login",  [
//   body('email', 'Enter a valid email').isEmail(),
//   body('password', 'Password cannot be blank').exists(),
// ], login);

// router.get("/check", fetchuser, checkAuthentication);

router.get("/getuser", fetchuser, getUser);

router.post("/getAllUser", fetchuser, getAllUser);

router.put("/updateUser/:id", fetchuser, updateUser);

router.delete("/deleteUser/:id", fetchuser, deleteUser);

router.post("/newuser", fetchuser, createUserByAdmin);

router.delete("/logout", fetchuser, logout);

router.get(
  "/auth/verify-pan/:pan",
  // param("pan", "Invalid PAN number.")
  //   .escape()
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 10, max: 10 })
  //   .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  // validateReq,
  verifyPan
);
// router.delete("/deleteUser/:id", fetchuser, deleteUser);
// router.put("/updatePassword/:id", [
//   body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),], fetchuser, resetPassword);

// router.post("/phonelogin",  [
//   body('phone', 'Enter a valid phone').isLength({ min: 10, max: 15}),
// ], phonelogin);

// otp apis

// router.post('/sendOtp', [
//   // body('otp', 'Enter a valid OTP').isLength({ min: 3 }),
//   body('purpose', 'Enter a valid purpose').notEmpty(),
//   body('phone', 'Enter a valid mobile number').isLength({ min: 10, max:15 }),
// ], otpController.sendOtp)

// router.post('/verifyOtp', [
//   body('otp', 'Enter a valid OTP').isLength({ min: 3 }),
//   body('phone', 'Enter a valid mobile number').isLength({ min: 10, max:15 }),
// ], otpController.verifyOtp)

module.exports = router;
