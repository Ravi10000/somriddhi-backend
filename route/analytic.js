const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  addCouponAnalytic,
  addCategoryAnalytic,
  updateCategoryAnalytic,
  updateCouponAnalytic,
} = require("../controllers/analytic");
const router = express.Router();

router.post("/analytic/category", addCategoryAnalytic);
router.patch("/analytic/category", updateCategoryAnalytic);
router.post("/analytic/coupon", addCouponAnalytic);
router.patch("/analytic/coupon", updateCouponAnalytic);

module.exports = router;
