const express = require('express');
const router = express.Router();
const { createDeal, getAllDeals, updateDeal, deleteDeal } = require('../controllers/Deal');
const { fetchuser } = require('../middleware/Auth');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    // filename: function (req, file, cb) {
    //     let url = Date.now() + path.extname(file.originalname);
    //     cb(null,url) 
    //     req.body.imageUrl = url;
    // }
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage });

router.post('/deal', upload.single('dealPhoto'), fetchuser, createDeal);
router.get('/deal', fetchuser, getAllDeals);
router.patch('/deal', upload.single('dealPhoto'), fetchuser, updateDeal);
router.delete('/deal', fetchuser, deleteDeal);

module.exports = router;