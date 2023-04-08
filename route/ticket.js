const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
  getMyTickets,
  addTicketReplies,
  updateTicketStatus,
} = require("../controllers/Ticket");
const { fetchuser, isAdmin } = require("../middleware/Auth");

router.post("/ticket", fetchuser, createTicket);
router.get("/mytickets", fetchuser, getMyTickets);
router.get("/ticket", fetchuser, getAllTickets);
router.patch("/ticket/status", fetchuser, isAdmin, updateTicketStatus);
router.post("/ticket/reply", fetchuser, isAdmin, addTicketReplies);
router.patch("/ticket", fetchuser, updateTicket);
router.delete("/ticket", fetchuser, deleteTicket);

module.exports = router;
