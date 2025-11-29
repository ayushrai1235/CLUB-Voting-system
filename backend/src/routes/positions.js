const express = require('express');
const router = express.Router();
const Position = require('../models/Position');

// Get all positions (public)
router.get('/', async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get elected positions only
router.get('/elected', async (req, res) => {
  try {
    const positions = await Position.find({ 
      isElected: true, 
      isFixed: false 
    }).sort({ name: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get fixed positions only
router.get('/fixed', async (req, res) => {
  try {
    const positions = await Position.find({ isFixed: true }).sort({ name: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single position
router.get('/:id', async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

