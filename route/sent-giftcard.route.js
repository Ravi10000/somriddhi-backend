const express = require("express");
const validateReq = require("../middleware/validate-req");
const { sendGiftcard } = require("../controllers/sent-giftcard.controller");
const { body } = require("express-validator");
const { fetchuser } = require("../middleware/Auth");

const router = express.Router();

router.post(
  "/send-giftcard",
  fetchuser,
  [
    body("senderName").notEmpty().withMessage("sendername required"),
    body("receiverName").notEmpty().withMessage("receiver name required"),
    body("receiverPhone")
      .isMobilePhone()
      .withMessage("invalid phone number")
      .notEmpty()
      .withMessage("phone required"),
    body("receiverEmail")
      .isEmail()
      .withMessage("invalid email")
      .notEmpty()
      .withMessage("email required"),
    body("giftcard").isMongoId().withMessage("invalid giftcard id"),
  ],
  validateReq,
  sendGiftcard
);

module.exports = router;
