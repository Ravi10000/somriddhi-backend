const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
} = require("../controllers/Category");
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

router.post(
  "/category",
  upload.single("categoryPhoto"),
  fetchuser,
  createCategory
);
router.get("/category", getCategories);
router.patch(
  "/category",
  upload.single("categoryPhoto"),
  fetchuser,
  updateCategory
);
router.delete("/category/:id", fetchuser, deleteCategory);
router.get("/category/single/:id", getCategoryById);
module.exports = router;
