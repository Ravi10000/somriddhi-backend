const express = require('express');
const router = express.Router();
const { createMembership, getMemberships, updateMembership, deleteMembership } = require('../controllers/Membership');
const { fetchuser } = require('../middleware/Auth');

router.post('/membership', fetchuser, createMembership);
router.get('/membership', fetchuser, getMemberships);
router.patch('/membership', fetchuser, updateMembership);
router.delete('/membership', fetchuser, deleteMembership);

module.exports = router;