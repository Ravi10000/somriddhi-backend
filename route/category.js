const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/Category');
const { fetchuser } = require('../middleware/Auth');

router.post('/category', fetchuser, createCategory);
router.get('/category', fetchuser, getCategories);
router.patch('/category', fetchuser, updateCategory);
router.delete('/category', fetchuser, deleteCategory);

module.exports = router;