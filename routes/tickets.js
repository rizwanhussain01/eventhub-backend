const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyTickets,
  cancelTicket
} = require('../controllers/ticketController');
const protect = require('../middleware/auth');

router.post('/events/:id/register', protect, registerForEvent);
router.get('/my-tickets', protect, getMyTickets);
router.delete('/:id', protect, cancelTicket);

module.exports = router;
