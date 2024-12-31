const express = require('express');
const { generateItineraryForLocation } = require('../services/openaiService'); // Import helper function

const router = express.Router();

router.post('/generate-itinerary', async (req, res) => {
  try {
    console.log('Payload received at /generate-itinerary:', req.body);

    const { location, numDays, likedDescriptions, budget, vacationType, likedPhotos } = req.body;

    if (!location || !numDays || !likedDescriptions || !budget) {
      console.error('Invalid payload:', req.body);
      return res.status(400).json({ error: 'Invalid payload: Missing required fields' });
    }

    const itinerary = await generateItineraryForLocation(
      location,
      numDays,
      likedDescriptions,
      budget,
      vacationType,
      likedPhotos
    );

    res.json({ itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error.stack);
    res.status(500).json({
      error: 'Failed to generate itinerary',
      details: error.message,
    });
  }
});


module.exports = router;
