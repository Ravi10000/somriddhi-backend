const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  createTransaction,
  updateTransactionStatus,
  getTransaction,
  updateTransactionPhonepe,
  checkPhonepeTransactionStatus,
} = require("../controllers/transaction.controller");
const { body } = require("express-validator");
const validateReq = require("../middleware/validate-req");

const router = express.Router();

router.post(
  "/transaction",
  fetchuser,
  [
    body("amount")
      .isNumeric()
      .withMessage("amount should be a number")
      .notEmpty()
      .withMessage("amount is required"),
    body("discountedAmount")
      .isNumeric()
      .withMessage("discounted amount should be a number")
      .notEmpty()
      .withMessage("discounted amount is required"),
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email is required"),
    body("mobile")
      .isMobilePhone()
      .withMessage("invalid mobile number")
      .notEmpty()
      .withMessage("mobile is required"),
    body("unitPrice")
      .isNumeric()
      .withMessage("unitPrice should be a number")
      .notEmpty()
      .withMessage("unitPrice is required"),
    body("quantity")
      .isNumeric()
      .withMessage("quantity should be a number")
      .notEmpty()
      .withMessage("quantity is required"),
    body("firstname").notEmpty().withMessage("firstname is required"),
    body("line1").notEmpty().withMessage("line1 is required"),
    body("district").notEmpty().withMessage("district is required"),
    body("state").notEmpty().withMessage("state is required"),
    body("postcode").notEmpty().withMessage("postcode is required"),
    body("method")
      .optional()
      .isIn(["phonepe", "yespay", "upigateway"])
      .withMessage(
        "invalid payment method, allowed values are phonepe, yespay, upigateway"
      ),
  ],
  validateReq,
  createTransaction
);
router.post("/transaction/update", updateTransactionStatus);
router.post("/transaction/update/phonepe", updateTransactionPhonepe);
router.get("/transaction/:id", fetchuser, getTransaction);
router.get(
  "/transaction/phonepe/:id",
  fetchuser,
  checkPhonepeTransactionStatus
);

module.exports = router;
