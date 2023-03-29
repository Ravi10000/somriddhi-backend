const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  addCouponAnalytic,
  updateCouponAnalytic,
  getCouponAnalytic,

  addCategoryAnalytic,
  updateCategoryAnalytic,
  getCategoryAnalytic,
} = require("../controllers/analytic");
const router = express.Router();

router.post("/analytic/category", fetchuser, addCategoryAnalytic);
router.patch("/analytic/category", updateCategoryAnalytic);
router.get("/analytic/category", getCategoryAnalytic); // add fetch user middleware

router.get("/analytic/coupon", getCouponAnalytic); // add fetch user middleware
router.post("/analytic/coupon", fetchuser, addCouponAnalytic);
router.patch("/analytic/coupon", updateCouponAnalytic);

module.exports = router;
