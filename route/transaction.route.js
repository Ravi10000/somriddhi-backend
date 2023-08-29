const express = require("express");
const { fetchuser } = require("../middleware/Auth");
const {
  createTransaction,
  updateTransactionStatus,
  getTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/transaction", fetchuser, createTransaction);
router.post("/transaction/update", fetchuser, updateTransactionStatus);
router.get("/transaction/:id", fetchuser, getTransaction);

module.exports = router;
