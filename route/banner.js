const express = require('express');
const router = express.Router();
const { createBanner, getBanners, updateBanner, deleteBanner } = require('../controllers/banner');
const { fetchuser } = require('../middleware/Auth');

router.post('/banner', fetchuser, createBanner);
router.get('/banner', fetchuser, getBanners);
router.patch('/banner', fetchuser, updateBanner);
router.delete('/banner', fetchuser, deleteBanner);

module.exports = router;