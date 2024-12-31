const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Function to fetch coordinates from city name using Google Geocoding API
const fetchCoordinatesFromCity = async (cityName) => {
  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const geocodeResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: cityName,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (geocodeResponse.data.status !== 'OK') {
      throw new Error(`Geocoding API Error: ${geocodeResponse.data.status}`);
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error('Error fetching coordinates from Google Geocoding API:', error.message);
    throw new Error('Failed to fetch coordinates');
  }
};

// Function to fetch places from Google Places API
const fetchPlacesFromGoogle = async (lat, lng, type, radius = 10000) => {  
  const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        type: type,
        key: GOOGLE_PLACES_API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      console.error(`Google Places API Error: ${response.data.status}`);
      return [];
    }

    return response.data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 'No rating',
      photoUrl: place.photos && place.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
        : null,
    }));
  } catch (error) {
    console.error('Error fetching places from Google Places API:', error.message);
    return [];
  }
};

// Define the /api/places route
router.get('/places', async (req, res) => {
  const { location, type } = req.query;

  if (!location || !type) {
    return res.status(400).json({ error: 'Missing required parameters: location and type' });
  }

  try {
    const { lat, lng } = await fetchCoordinatesFromCity(location);
    const places = await fetchPlacesFromGoogle(lat, lng, type);

    if (places.length === 0) {
      return res.status(404).json({ error: `No places found for ${location}` });
    }

    res.json({ results: places });
  } catch (error) {
    console.error('Error in /places route:', error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

module.exports = router;
