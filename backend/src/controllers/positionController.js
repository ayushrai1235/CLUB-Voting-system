import Position from '../models/Position.js';

// Get all positions (public)
export const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get elected positions only
export const getElectedPositions = async (req, res) => {
  try {
    const positions = await Position.find({ 
      isElected: true, 
      isFixed: false 
    }).sort({ name: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get fixed positions only
export const getFixedPositions = async (req, res) => {
  try {
    const positions = await Position.find({ isFixed: true }).sort({ name: 1 });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single position
export const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
