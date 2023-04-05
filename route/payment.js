const express = require("express");
const router = express.Router();
const { generateCashback: getExcelData } = require("../controllers/ReadFile");
const { fetchuser } = require("../middleware/auth");

const multer = require("multer");
// const upload = multer({ dest: 'uploads/' });
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },

  filename: function (req, file, cb) {
    console.log({ file });
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/getexceldata", upload.single("fileExcel"), getExcelData);

module.exports = router;
