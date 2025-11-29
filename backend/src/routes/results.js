const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const Election = require('../models/Election');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const User = require('../models/User');

// Get results for an election (only if ended)
router.get('/election/:electionId', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    // Check if election has ended
    if (!election.hasEnded()) {
      return res.status(403).json({ message: 'Election results are not available yet' });
    }
    
    // Get all positions in this election
    const positions = await Position.find({ _id: { $in: election.positions } });
    
    // Get results for each position
    const results = await Promise.all(
      positions.map(async (position) => {
        const candidates = await Candidate.find({
          position: position._id,
          status: 'approved'
        })
          .populate('user', 'name email profilePhoto')
          .sort({ voteCount: -1 });
        
        const totalVotes = await Vote.countDocuments({
          election: election._id,
          position: position._id
        });
        
        return {
          position: {
            id: position._id,
            name: position.name,
            description: position.description,
            isElected: position.isElected,
            isFixed: position.isFixed
          },
          candidates: candidates.map(c => ({
            id: c._id,
            user: c.user,
            manifesto: c.manifesto,
            voteCount: c.voteCount
          })),
          totalVotes,
          winner: candidates.length > 0 && candidates[0].voteCount > 0 ? candidates[0] : null
        };
      })
    );
    
    res.json({
      election: {
        id: election._id,
        name: election.name,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate
      },
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get results summary (admin only - can see before election ends)
router.get('/summary/:electionId', authenticate, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin') {
      const election = await Election.findById(req.params.electionId);
      if (!election || !election.hasEnded()) {
        return res.status(403).json({ message: 'Results not available' });
      }
    }
    
    const election = await Election.findById(req.params.electionId);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    const positions = await Position.find({ _id: { $in: election.positions } });
    
    const results = await Promise.all(
      positions.map(async (position) => {
        const candidates = await Candidate.find({
          position: position._id,
          status: 'approved'
        })
          .populate('user', 'name email profilePhoto')
          .sort({ voteCount: -1 });
        
        const totalVotes = await Vote.countDocuments({
          election: election._id,
          position: position._id
        });
        
        return {
          position: {
            id: position._id,
            name: position.name,
            description: position.description
          },
          candidates: candidates.map(c => ({
            id: c._id,
            user: c.user,
            manifesto: c.manifesto,
            voteCount: c.voteCount
          })),
          totalVotes,
          winner: candidates.length > 0 && candidates[0].voteCount > 0 ? candidates[0] : null
        };
      })
    );
    
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalVoters = await Vote.distinct('user', { election: election._id }).then(users => users.length);
    const totalVotes = await Vote.countDocuments({ election: election._id });
    
    res.json({
      election: {
        id: election._id,
        name: election.name,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status
      },
      statistics: {
        totalUsers,
        totalVoters,
        totalVotes,
        voterTurnout: totalUsers > 0 ? ((totalVoters / totalUsers) * 100).toFixed(2) : 0
      },
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Export results as CSV (admin only)
router.get('/export/:electionId', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const election = await Election.findById(req.params.electionId);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    const positions = await Position.find({ _id: { $in: election.positions } });
    
    let csv = 'Position,Candidate Name,Candidate Email,Votes,Percentage\n';
    
    for (const position of positions) {
      const candidates = await Candidate.find({
        position: position._id,
        status: 'approved'
      })
        .populate('user', 'name email')
        .sort({ voteCount: -1 });
      
      const totalVotes = await Vote.countDocuments({
        election: election._id,
        position: position._id
      });
      
      for (const candidate of candidates) {
        const percentage = totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) : '0.00';
        csv += `"${position.name}","${candidate.user.name}","${candidate.user.email}",${candidate.voteCount},${percentage}%\n`;
      }
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=election-results-${election._id}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

