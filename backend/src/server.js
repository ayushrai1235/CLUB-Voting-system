import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import positionRoutes from './routes/positions.js';
import candidateRoutes from './routes/candidates.js';
import electionRoutes from './routes/elections.js';
import voteRoutes from './routes/votes.js';
import resultRoutes from './routes/results.js';
import userRoutes from './routes/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
// Serve uploaded files - REMOVED (Using Cloudinary)
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);

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

