const express = require("express");
const router = express.Router();

const {
  createContent,
  updateContent,
  deleteContent,
  getContent,
} = require("../controllers/content");
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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/content", upload.single("image"), fetchuser, createContent);
router.put("/content/:id", upload.single("image"), fetchuser, updateContent);
router.delete("/content/:id", fetchuser, deleteContent);
router.get("/content", getContent);

module.exports = router;
