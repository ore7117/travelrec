const mongoose = require('mongoose');

// Define the Trip schema
const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String,
  }],
  activities: [{
    type: String,
  }],
  budget: {
    type: Number,
    required: true,
  },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Create the Trip model from the schema
const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;

