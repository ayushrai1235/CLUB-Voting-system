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

// Get all active and upcoming elections
export const getActiveElections = async (req, res) => {
  try {
    const now = new Date();

    // 1. Check for upcoming elections that should be active
    const upcomingElections = await Election.find({
      status: 'upcoming',
      startDate: { $lte: now }
    });

    // Update their status to active
    if (upcomingElections.length > 0) {
      await Promise.all(upcomingElections.map(async (election) => {
        election.status = 'active';
        await election.save();
      }));
    }

    // 2. Find all active and upcoming elections
    const elections = await Election.find({ 
      status: { $in: ['active', 'upcoming'] } 
    }).sort({ startDate: 1 }); // Sort by start date ascending
    
    // 3. Check if any active election has ended based on date
    const updatedElections = await Promise.all(elections.map(async (election) => {
      if (election.status === 'active' && new Date(election.endDate) < now) {
        election.status = 'ended';
        await election.save();
        return null; // Filter out ended ones from this list
      }
      return election;
    }));

    // Filter out nulls (ended elections)
    const activeElections = updatedElections.filter(e => e !== null);
    
    res.json(activeElections);
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
