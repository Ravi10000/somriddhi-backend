const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  updateFeedbackStatus,
} = require("../controllers/Feedback");
const { fetchuser } = require("../middleware/Auth");

router.delete("/feedback/:id", fetchuser, deleteFeedback);
router.post("/feedback", fetchuser, createFeedback);
router.patch("/feedback", fetchuser, updateFeedbackStatus);
router.get("/feedback", fetchuser, getAllFeedbacks);

module.exports = router;
