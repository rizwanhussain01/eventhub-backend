const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
} = require('../controllers/eventController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');

router.get('/', getAllEvents);
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), getOrganizerEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

module.exports = router;
