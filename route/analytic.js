const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  addCouponAnalytic,
  addCategoryAnalytic,
  updateCategoryAnalytic,
  updateCouponAnalytic,
} = require("../controllers/analytic");
const router = express.Router();

router.post("/analytic/category", fetchuser, addCategoryAnalytic);
router.post("/analytic/coupon", fetchuser, addCouponAnalytic);
router.patch("/analytic/category", updateCategoryAnalytic);
router.patch("/analytic/coupon", updateCouponAnalytic);

module.exports = router;
