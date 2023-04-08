const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  updateFeedbackStatus,
} = require("../controllers/Feedback");
const { fetchuser, isAdmin } = require("../middleware/Auth");

router.delete("/feedback/:id", fetchuser, isAdmin, deleteFeedback);
router.post("/feedback", fetchuser, isAdmin, createFeedback);
router.patch("/feedback", fetchuser, isAdmin, updateFeedbackStatus);
router.get("/feedback", fetchuser, getAllFeedbacks);

module.exports = router;
