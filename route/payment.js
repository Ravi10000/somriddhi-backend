const express = require("express");
const router = express.Router();
const {
    getExcelData
} = require("../controllers/ReadFile");
const { fetchuser } = require("../middleware/Auth");

const multer = require("multer");
// const upload = multer({ dest: 'uploads/' });
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    // filename: function (req, file, cb) {
    //     let url = Date.now() + path.extname(file.originalname);
    //     cb(null,url)
    //     req.body.imageUrl = url;
    // }
    filename: function (req, file, cb) {
        console.log({ file });
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post(
    "/getexceldata",
    upload.single("fileExcel"),
    fetchuser,
    getExcelData
);

module.exports = router;