const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var fetchuser = require('../middleware/Auth');

const authController = require('../controllers/User');
const otpController = require('../controllers/Otp');

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post("/signup", [
  body('fname', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('phone', 'Enter a valid phone').isLength({ min: 10, max: 15}).isNumeric(),
  body('usertype', 'Enter a valid usertype').notEmpty(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], authController.signup);

router.post("/login",  [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], authController.login);

router.get('/check', fetchuser, authController.checkAuthentication);

router.post('/getuser', fetchuser, authController.getUser)

router.post('/getAllUser', fetchuser, authController.getAllUser)

router.put("/updateUser/:id", fetchuser, authController.updateUser);

router.delete('/deleteUser/:id', fetchuser, authController.deleteUser)
// router.delete("/deleteUser/:id", fetchuser, authController.deleteUser);
// router.put("/updatePassword/:id", [
//   body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),], fetchuser, authController.resetPassword);


router.post("/phonelogin",  [
  body('phone', 'Enter a valid phone').isLength({ min: 10, max: 15}),
], authController.phonelogin);

// otp apis 

router.post('/sendOtp', [
  // body('otp', 'Enter a valid OTP').isLength({ min: 3 }),
  body('purpose', 'Enter a valid purpose').notEmpty(),
  body('phone', 'Enter a valid mobile number').isLength({ min: 10, max:15 }),
], otpController.sendOtp)

router.post('/verifyOtp', [
  body('otp', 'Enter a valid OTP').isLength({ min: 3 }),
  body('phone', 'Enter a valid mobile number').isLength({ min: 10, max:15 }),
], otpController.verifyOtp)

module.exports = router