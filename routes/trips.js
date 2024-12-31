const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');  // Adjust the path as necessary
const auth = require('../middleware/auth'); // Middleware for authentication

// Create a new trip
router.post('/create', auth, async (req, res) => {
  try {
    const { destination, images, activities, budget, userIds } = req.body;
    const trip = new Trip({ destination, images, activities, budget, userIds });
    await trip.save();
    res.status(201).send(trip);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find().populate('userIds');
    res.status(200).send(trips);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get a trip by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userIds');
    if (!trip) return res.status(404).send({ error: 'Trip not found' });
    res.status(200).send(trip);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update a trip
router.put('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).send({ error: 'Trip not found' });
    res.status(200).send(trip);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete a trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).send({ error: 'Trip not found' });
    res.status(200).send({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
