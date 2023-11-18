const express = require("express");
const {
  addAdmin,
  loginAdmin,
  resetPassword,
  generateResetPasswordRequest,
} = require("../controllers/admin.controller");
const router = express.Router();

router.post("/", loginAdmin);
router.post("/request-reset-password", generateResetPasswordRequest);
router.put("/reset-password", resetPassword);

module.exports = router;
