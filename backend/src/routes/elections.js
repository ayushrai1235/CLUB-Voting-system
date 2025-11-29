const express = require('express');
const router = express.Router();
const Election = require('../models/Election');

// Get all elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('positions')
      .sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active election
router.get('/active', async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'active' })
      .populate('positions');
    
    if (!election) {
      return res.json(null);
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single election
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('positions');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

