const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended'],
    default: 'upcoming'
  },
  positions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position'
  }]
}, {
  timestamps: true
});

// Method to check if election is active
electionSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

// Method to check if election has ended
electionSchema.methods.hasEnded = function() {
  return new Date() > this.endDate;
};

module.exports = mongoose.model('Election', electionSchema);

