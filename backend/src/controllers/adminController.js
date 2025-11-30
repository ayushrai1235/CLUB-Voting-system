import Position from '../models/Position.js';
import Candidate from '../models/Candidate.js';
import Election from '../models/Election.js';
import User from '../models/User.js';
import Vote from '../models/Vote.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
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
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'member' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all positions
export const getPositions = async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create position
export const createPosition = async (req, res) => {
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
};

// Update position
export const updatePosition = async (req, res) => {
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
};

// Delete position
export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description')
      .sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve candidate
export const approveCandidate = async (req, res) => {
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
};

// Reject candidate
export const rejectCandidate = async (req, res) => {
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
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all elections
export const getElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('positions')
      .sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create election
export const createElection = async (req, res) => {
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
};

// Update election
export const updateElection = async (req, res) => {
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
};

// Delete election
export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get voting statistics
export const getVotingStatistics = async (req, res) => {
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
};
