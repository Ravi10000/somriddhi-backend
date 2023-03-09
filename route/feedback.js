const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedbacks, updateFeedback, deleteFeedback } = require('../controllers/Feedback');
const { fetchuser } = require('../middleware/Auth');

router.post('/feedback', fetchuser, createFeedback);
router.get('/feedback', fetchuser, getAllFeedbacks);
router.delete('/feedback', fetchuser, deleteFeedback);

module.exports = router;