const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/positions', require('./routes/positions'));
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/elections', require('./routes/elections'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/results', require('./routes/results'));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-system';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('whitelist') || err.message.includes('IP')) {
      console.error('\n⚠️  IP ADDRESS NOT WHITELISTED');
      console.error('Your IP address needs to be added to MongoDB Atlas Network Access.');
      console.error('Steps to fix:');
      console.error('1. Go to: https://cloud.mongodb.com/');
      console.error('2. Select your cluster');
      console.error('3. Click "Network Access" in the left menu');
      console.error('4. Click "Add IP Address"');
      console.error('5. Click "Allow Access from Anywhere" (for development) or add your current IP');
      console.error('6. Wait 1-2 minutes for changes to take effect');
    } else {
      console.error('Please check your MONGODB_URI in .env file');
    }
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

