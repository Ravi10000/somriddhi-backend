const express = require('express');
const router = express.Router();
const { createDeal, getAllDeals, updateDeal, deleteDeal } = require('../controllers/Deal');
const { fetchuser } = require('../middleware/Auth');

router.post('/deal', fetchuser, createDeal);
router.get('/deal', fetchuser, getAllDeals);
router.patch('/deal', fetchuser, updateDeal);
router.delete('/deal', fetchuser, deleteDeal);

module.exports = router;