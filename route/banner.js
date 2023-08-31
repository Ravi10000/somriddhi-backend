const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  getBannerById,
  getActiveBanners,
  changeStatus,
  changePriorityOrder,
} = require("../controllers/banner");
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
    // const [fileName, extention] = file.originalname.split(".");
    // cb(null, fileName + "-" + Date.now() + "." + extention);
  },
});

const upload = multer({ storage });

router.post("/banner/changestatus", fetchuser, isAdmin, changeStatus);
router.post(
  "/banner",
  upload.single("bannerPhoto"),
  fetchuser,
  isAdmin,
  createBanner
);
router.get("/banner/active", getActiveBanners);
router.get("/banner/:id", getBannerById); // ????
router.get("/banner", getBanners);
router.patch(
  "/banner",
  upload.single("bannerPhoto"),
  fetchuser,
  isAdmin,
  updateBanner
);
router.delete("/banner/:id", fetchuser, isAdmin, deleteBanner);

module.exports = router;
