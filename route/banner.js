const express = require('express');
const router = express.Router();
const { createBanner, getBanners, updateBanner, deleteBanner } = require('../controllers/banner');
const { fetchuser } = require('../middleware/Auth');

router.post('/banner', createBanner);
router.get('/banner', getBanners);
router.patch('/banner', updateBanner);
router.delete('/banner', deleteBanner);

module.exports = router;