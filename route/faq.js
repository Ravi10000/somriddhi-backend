const express = require('express');
const router = express.Router();
const { createFaq, getFaqs, updateFaq, deleteFaq } = require('../controllers/Faq');
const { fetchuser } = require('../middleware/Auth');

router.post('/faq', fetchuser, createFaq);
router.get('/faq', fetchuser, getFaqs);
router.patch('/faq', fetchuser, updateFaq);
router.delete('/faq/:id', fetchuser, deleteFaq);

module.exports = router;