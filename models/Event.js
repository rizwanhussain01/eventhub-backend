const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    minlength: 10,
    maxlength: 2000
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Meetup', 'Concert', 'Sports', 'Exhibition', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1,
    max: 100000
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1, city: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
