const express = require("express");
const router = express.Router();
const {
  createDeal,
  getAllDeals,
  updateDeal,
  deleteDeal,
  getDealById,
} = require("../controllers/Deal");
const { fetchuser, isAdmin } = require("../middleware/Auth");
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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/deal",
  upload.single("dealPhoto"),
  fetchuser,
  isAdmin,
  createDeal
);
router.patch(
  "/deal",
  upload.single("dealPhoto"),
  fetchuser,
  isAdmin,
  updateDeal
);
router.delete("/deal/:id", fetchuser, isAdmin, deleteDeal);
router.get("/deal/single/:id", getDealById);
router.get("/deal/:categoryId", getAllDeals);
router.get("/deal", getAllDeals);

module.exports = router;
