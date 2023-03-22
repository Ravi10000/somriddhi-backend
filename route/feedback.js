const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/Feedback");
const { fetchuser } = require("../middleware/Auth");

router.delete("/feedback", fetchuser, deleteFeedback);
router.post("/feedback", fetchuser, createFeedback);
router.get("/feedback", fetchuser, getAllFeedbacks);

module.exports = router;
