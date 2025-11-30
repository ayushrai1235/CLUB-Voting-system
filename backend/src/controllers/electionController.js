import Election from '../models/Election.js';

// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('positions')
      .sort({ createdAt: -1 });

    // Check and update statuses
    const now = new Date();
    const updatedElections = await Promise.all(elections.map(async (election) => {
      if (election.status !== 'ended' && new Date(election.endDate) < now) {
        election.status = 'ended';
        await election.save();
      }
      return election;
    }));

    res.json(updatedElections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active election
export const getActiveElection = async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'active' })
      .populate('positions');
    
    if (!election) {
      return res.json(null);
    }

    // Check if election has ended based on date
    if (new Date(election.endDate) < new Date()) {
      election.status = 'ended';
      await election.save();
      return res.json(null);
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single election
export const getElectionById = async (req, res) => {
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
};

// Get latest ended election
export const getLatestEndedElection = async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'ended' })
      .sort({ endDate: -1 })
      .populate('positions');
    
    if (!election) {
      return res.json(null);
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
