const express = require("express");
const { addAdmin, loginAdmin } = require("../controllers/admin.controller");
const router = express.Router();

router.post("/", loginAdmin);

module.exports = router;
