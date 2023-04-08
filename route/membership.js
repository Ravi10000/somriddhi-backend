const express = require("express");
const router = express.Router();
const {
  createMembership,
  getMemberships,
  updateMembership,
  deleteMembership,
  getMembershipById,
} = require("../controllers/Membership");
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
    console.log({ file });
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/membership",
  upload.single("membershipPhoto"),
  fetchuser,
  isAdmin,
  createMembership
);
router.patch(
  "/membership",
  upload.single("membershipPhoto"),
  fetchuser,
  isAdmin,
  updateMembership
);
router.delete("/membership/:id", fetchuser, isAdmin, deleteMembership);
router.get("/membership/:id", getMembershipById);
router.get("/membership", getMemberships);

module.exports = router;
