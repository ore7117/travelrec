const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Access denied, no token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({ error: 'User already registered.' });
    }
    user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ token, user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token, user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { vacationType, partnerInfo, kidsInfo } = req.body;

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    // Update the user's profile fields
    user.vacationType = vacationType || user.vacationType;
    user.partnerInfo = partnerInfo || user.partnerInfo;
    user.kidsInfo = kidsInfo || user.kidsInfo;

    await user.save();
    res.status(200).send({ user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
