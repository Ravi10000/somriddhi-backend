const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets, updateTicket, deleteTicket } = require('../controllers/Ticket');
const { fetchuser } = require('../middleware/Auth');

router.post('/ticket', fetchuser, createTicket);
router.get('/ticket', fetchuser, getAllTickets);
router.patch('/ticket', fetchuser, updateTicket);
router.delete('/ticket', fetchuser, deleteTicket);

module.exports = router;