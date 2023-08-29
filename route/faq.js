const express = require("express");
const router = express.Router();
const {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
} = require("../controllers/Faq");
const { fetchuser, isAdmin } = require("../middleware/Auth");

router.post("/faq", fetchuser, isAdmin, createFaq);
router.get("/faq", fetchuser, getFaqs);
router.patch("/faq", fetchuser, isAdmin, updateFaq);
router.delete("/faq/:id", fetchuser, isAdmin, deleteFaq);

module.exports = router;
