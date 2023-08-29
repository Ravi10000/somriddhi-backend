const express = require("express");
const router = express.Router();
const {
  generateCashback,
  updatePayouts,
  generateRequest,
  fetchAllPayments,
  fetchAllPayouts,
} = require("../controllers/ReadFile");
const { fetchuser, isAdmin } = require("../middleware/Auth");

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

router.post(
  "/payment",
  upload.single("fileExcel"),
  fetchuser,
  isAdmin,
  generateCashback
);
router.post(
  "/payout",
  upload.single("fileExcel"),
  fetchuser,
  isAdmin,
  updatePayouts
);
router.post("/paymentrequest", fetchuser, generateRequest);
router.get("/payment", fetchuser, isAdmin, fetchAllPayments);
router.get("/payout", fetchuser, isAdmin, fetchAllPayouts);

module.exports = router;
