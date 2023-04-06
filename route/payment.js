const express = require("express");
const router = express.Router();
const { generateCashback, updatePayouts, generateRequest } = require("../controllers/ReadFile");
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
    const [fileName, extention] = file.originalname.split(".");
    cb(null, fileName + "-" + Date.now() + "." + extention);
  },
});

const upload = multer({ storage });

router.post("/payment", upload.single("fileExcel"), generateCashback);
router.post("/payout", upload.single("fileExcel"), updatePayouts);
router.post("/paymentrequest", fetchuser, generateRequest);

module.exports = router;
