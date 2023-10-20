const express = require("express");
const validateReq = require("../middleware/validate-req");
const {
  manageGiftcardDiscount,
  fetchDiscount,
} = require("../controllers/giftcard-discount.controller");
const { body } = require("express-validator");
const { fetchuser, isAdmin } = require("../middleware/Auth");
const router = express.Router();

router.post(
  "/giftcard/discount",
  fetchuser,
  isAdmin,
  [
    body("discountPercentage")
      .isNumeric()
      .withMessage("invalid discount percentage")
      .notEmpty()
      .withMessage("discount percentage required"),
  ],
  validateReq,
  manageGiftcardDiscount
);

router.get("/giftcard/discount", fetchDiscount);

module.exports = router;
