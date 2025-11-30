import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  manifesto: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  voteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one candidate per user per position
candidateSchema.index({ user: 1, position: 1 }, { unique: true });

export default mongoose.model('Candidate', candidateSchema);

