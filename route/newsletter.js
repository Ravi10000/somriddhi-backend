const express = require('express');
const router = express.Router();
const { createNewsletter, getAllNewsletters, updateNewsletter, deleteNewsletter } = require('../controllers/Newsletter');
const { fetchuser } = require('../middleware/Auth');

router.post('/newsletter', fetchuser, createNewsletter);
router.get('/newsletter', fetchuser, getAllNewsletters);
router.delete('/newsletter', fetchuser, deleteNewsletter);

module.exports = router;