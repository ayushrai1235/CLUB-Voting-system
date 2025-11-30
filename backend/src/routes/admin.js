import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Position from '../models/Position.js';
import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';
import User from '../models/User.js';
import Vote from '../models/Vote.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalCandidates = await Candidate.countDocuments({ status: 'approved' });
    const pendingApplications = await Candidate.countDocuments({ status: 'pending' });
    const activeElections = await Election.countDocuments({ status: 'active' });
    
    res.json({
      totalUsers,
      totalCandidates,
      pendingApplications,
      activeElections
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'member' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all positions
router.get('/positions', async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create position
router.post('/positions', async (req, res) => {
  try {
    const { name, description, isElected, isFixed } = req.body;
    
    const position = new Position({
      name,
      description,
      isElected: isElected !== undefined ? isElected : true,
      isFixed: isFixed || false
    });
    
    await position.save();
    res.status(201).json({ message: 'Position created successfully', position });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Position with this name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update position
router.put('/positions/:id', async (req, res) => {
  try {
    const { name, description, isElected, isFixed } = req.body;
    
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { name, description, isElected, isFixed },
      { new: true, runValidators: true }
    );
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.json({ message: 'Position updated successfully', position });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete position
router.delete('/positions/:id', async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description')
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve candidate
router.put('/candidates/:id/approve', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('user', 'name email profilePhoto').populate('position', 'name');
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate approved successfully', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject candidate
router.put('/candidates/:id/reject', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate rejected successfully', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete candidate
router.delete('/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all elections
router.get('/elections', async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('positions')
      .sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create election
router.post('/elections', async (req, res) => {
  try {
    const { name, description, startDate, endDate, positions } = req.body;
    
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide name, startDate, and endDate' });
    }
    
    const election = new Election({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      positions: positions || [],
      status: new Date() > new Date(endDate) ? 'ended' : 
              (new Date() >= new Date(startDate) ? 'active' : 'upcoming')
    });
    
    await election.save();
    res.status(201).json({ message: 'Election created successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update election
router.put('/elections/:id', async (req, res) => {
  try {
    const { name, description, startDate, endDate, positions, status } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (positions) updateData.positions = positions;
    if (status) updateData.status = status;
    
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('positions');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json({ message: 'Election updated successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete election
router.delete('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get voting statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'member' });
    const totalVoters = await Vote.distinct('user').then(users => users.length);
    const totalVotes = await Vote.countDocuments();
    
    res.json({
      totalUsers,
      totalVoters,
      totalVotes,
      voterTurnout: totalUsers > 0 ? ((totalVoters / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

