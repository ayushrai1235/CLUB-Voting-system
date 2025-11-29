const express = require('express');
const router = express.Router();
const { authenticate, isMember } = require('../middleware/auth');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const User = require('../models/User');

// Get all approved candidates for a position
router.get('/position/:positionId', async (req, res) => {
  try {
    const candidates = await Candidate.find({
      position: req.params.positionId,
      status: 'approved'
    })
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description');
    
    // Shuffle candidates to randomize order
    const shuffled = candidates.sort(() => 0.5 - Math.random());
    
    res.json(shuffled);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all approved candidates (for voting page)
router.get('/approved', async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: 'approved' })
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description isElected isFixed');
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Member: Apply as candidate
router.post('/apply', authenticate, isMember, async (req, res) => {
  try {
    const { positionId, manifesto } = req.body;
    
    if (!positionId || !manifesto) {
      return res.status(400).json({ message: 'Please provide position and manifesto' });
    }
    
    // Check if position exists and is elected
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    if (!position.isElected || position.isFixed) {
      return res.status(400).json({ message: 'Cannot apply for this position' });
    }
    
    // Check if user already applied for this position
    const existingApplication = await Candidate.findOne({
      user: req.user._id,
      position: positionId
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }
    
    // Create candidate application
    const candidate = new Candidate({
      user: req.user._id,
      position: positionId,
      manifesto,
      status: 'pending'
    });
    
    await candidate.save();
    
    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description');
    
    res.status(201).json({
      message: 'Application submitted successfully. Waiting for admin approval.',
      candidate: populatedCandidate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Member: Get own applications
router.get('/my-applications', authenticate, isMember, async (req, res) => {
  try {
    const candidates = await Candidate.find({ user: req.user._id })
      .populate('position', 'name description')
      .sort({ createdAt: -1 });
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

