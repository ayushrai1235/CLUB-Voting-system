import Candidate from '../models/Candidate.js';
import Position from '../models/Position.js';

// Get all approved candidates for a position
export const getCandidatesByPosition = async (req, res) => {
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
};

// Get all approved candidates (for voting page)
export const getApprovedCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: 'approved' })
      .populate('user', 'name email profilePhoto')
      .populate('position', 'name description isElected isFixed');
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Member: Apply as candidate
export const applyForPosition = async (req, res) => {
  try {
    const { positionId, electionId, manifesto } = req.body;
    
    if (!positionId || !electionId || !manifesto) {
      return res.status(400).json({ message: 'Please provide position, election, and manifesto' });
    }
    
    // Check if position exists and is elected
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    if (!position.isElected || position.isFixed) {
      return res.status(400).json({ message: 'Cannot apply for this position' });
    }

    // Check if election exists (optional: check if active/upcoming)
    // For now, we assume the frontend sends a valid active/upcoming election ID
    
    // Check if user already applied for this position in this election
    const existingApplication = await Candidate.findOne({
      user: req.user._id,
      position: positionId,
      election: electionId
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this position in this election' });
    }
    
    // Create candidate application
    const candidate = new Candidate({
      user: req.user._id,
      position: positionId,
      election: electionId,
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
};

// Member: Get own applications
export const getMyApplications = async (req, res) => {
  try {
    const candidates = await Candidate.find({ user: req.user._id })
      .populate('position', 'name description')
      .populate('election', 'name status')
      .sort({ createdAt: -1 });
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
