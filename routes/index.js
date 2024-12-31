const express = require('express');
const router = express.Router();

// Define a route for the home page
router.get('/', (req, res) => {
  res.send('Welcome to the Travel Recommendation System!');
});

// Add other general routes if needed
router.get('/about', (req, res) => {
  res.send('This is the about page for the Travel Recommendation System.');
});

module.exports = router;
