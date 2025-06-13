const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Create ticket
router.post('/create-ticket', ticketController.createTicket);
router.get('/count/:user_id/:show_id', ticketController.getTicketCount);

// Get all tickets
router.get('/fetch-all-ticket', ticketController.getAllTickets);

// Get single ticket by ID
router.get('/:id', ticketController.getTicketById);

// Update ticket by ID
router.put('/update-ticket/:id', ticketController.updateTicket);

// Delete ticket by ID
router.delete('/delete-ticket/:id', ticketController.deleteTicket);

module.exports = router;
