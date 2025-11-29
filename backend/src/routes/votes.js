const express = require('express');
const router = express.Router();
const { authenticate, isMember } = require('../middleware/auth');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');

// Member: Submit vote
router.post('/cast', authenticate, isMember, async (req, res) => {
  try {
    const { electionId, positionId, candidateId } = req.body;
    
    if (!electionId || !positionId || !candidateId) {
      return res.status(400).json({ message: 'Please provide election, position, and candidate' });
    }
    
    // Check if election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    if (!election.isActive()) {
      return res.status(400).json({ message: 'Election is not currently active' });
    }
    
    // Check if position exists and is elected
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    if (!position.isElected || position.isFixed) {
      return res.status(400).json({ message: 'Cannot vote for this position' });
    }
    
    // Check if candidate exists and is approved
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    if (candidate.status !== 'approved') {
      return res.status(400).json({ message: 'Candidate is not approved' });
    }
    
    if (candidate.position.toString() !== positionId) {
      return res.status(400).json({ message: 'Candidate does not belong to this position' });
    }
    
    // Check if user already voted for this position in this election
    const existingVote = await Vote.findOne({
      user: req.user._id,
      election: electionId,
      position: positionId
    });
    
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this position' });
    }
    
    // Create vote
    const vote = new Vote({
      user: req.user._id,
      election: electionId,
      position: positionId,
      candidate: candidateId
    });
    
    await vote.save();
    
    // Update candidate vote count
    candidate.voteCount += 1;
    await candidate.save();
    
    res.status(201).json({
      message: 'Vote cast successfully',
      vote
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already voted for this position' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Member: Check if user has voted for a position
router.get('/check/:electionId/:positionId', authenticate, isMember, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      user: req.user._id,
      election: req.params.electionId,
      position: req.params.positionId
    });
    
    res.json({ hasVoted: !!vote, vote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Member: Get user's votes
router.get('/my-votes', authenticate, isMember, async (req, res) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .populate('election', 'name')
      .populate('position', 'name')
      .populate('candidate', 'manifesto')
      .populate({
        path: 'candidate',
        populate: { path: 'user', select: 'name profilePhoto' }
      })
      .sort({ timestamp: -1 });
    
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

