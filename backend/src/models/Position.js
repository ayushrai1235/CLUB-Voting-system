const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isElected: {
    type: Boolean,
    default: true
  },
  isFixed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Position', positionSchema);

