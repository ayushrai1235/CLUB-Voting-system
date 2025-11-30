import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Election from '../models/Election.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoURI = 'mongodb://127.0.0.1:27017/voting-system';

const setupData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    // 1. Create Test User
    const email = 'verify@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.deleteOne({ email }); // Clean up if exists
    
    const user = await User.create({
      name: 'Verify User',
      email,
      password: hashedPassword,
      role: 'member',
      isVerified: true,
      profilePhoto: '/uploads/default.png' // Dummy path
    });
    console.log('Test user created:', email);

    // 2. Create Ended Election
    // First, ensure no active elections to avoid conflict in logic (though logic prioritizes active)
    // Actually, we want to test "No active election" -> "Check ended".
    // So we should mark all current active elections as ended or delete them.
    // For safety, let's just mark them as ended.
    
    await Election.updateMany(
      { status: 'active' },
      { $set: { status: 'ended', endDate: new Date(Date.now() - 86400000) } }
    );
    console.log('Marked all active elections as ended');

    // Create a specific ended election
    const endedElection = await Election.create({
      name: 'Verification Past Election',
      description: 'An election that has ended',
      startDate: new Date(Date.now() - 172800000), // 2 days ago
      endDate: new Date(Date.now() - 86400000),   // 1 day ago
      status: 'ended'
    });
    console.log('Created ended election:', endedElection.name);

    console.log('Setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

setupData();
