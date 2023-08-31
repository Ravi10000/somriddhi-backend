const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  createTransaction,
  updateTransactionStatus,
  getTransaction,
} = require("../controllers/transaction.controller");
const { body } = require("express-validator");

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
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email is required"),
    body("phone")
      .isMobilePhone()
      .withMessage("invalid mobile number")
      .notEmpty()
      .withMessage("mobile is required"),
    body("unityPrice")
      .isNumeric()
      .withMessage("unityPrice should be a number")
      .notEmpty()
      .withMessage("unityPrice is required"),
    body("quantity")
      .isNumeric()
      .withMessage("quantity should be a number")
      .notEmpty()
      .withMessage("quantity is required"),
    body("firstname").notEmpty().withMessage("firstname is required"),
    body("line1").notEmpty().withMessage("line1 is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("region").notEmpty().withMessage("region is required"),
    body("postcode").notEmpty().withMessage("pincode is required"),
  ],
  createTransaction
);
router.post("/transaction/update", updateTransactionStatus);
router.get("/transaction/:id", fetchuser, getTransaction);

module.exports = router;
