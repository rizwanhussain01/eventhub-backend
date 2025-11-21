const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const crypto = require('crypto');

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is published
    if (!event.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'This event is not available for registration'
      });
    }

    // Check if event date has passed
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for past events'
      });
    }

    // Check if already registered
    const existingTicket = await Ticket.findOne({ eventId, userId, status: 'active' });
    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked'
      });
    }

    // Generate unique ticket ID
    const ticketId = `TICKET-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create ticket
    const ticket = await Ticket.create({
      eventId,
      userId,
      ticketId
    });

    // Update event registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id, status: 'active' })
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel ticket
// @route   DELETE /api/tickets/:id
// @access  Private
exports.cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check ownership
    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ticket'
      });
    }

    // Update ticket status
    ticket.status = 'cancelled';
    await ticket.save();

    // Update event registered count
    const event = await Event.findById(ticket.eventId);
    if (event) {
      event.registeredCount = Math.max(0, event.registeredCount - 1);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
