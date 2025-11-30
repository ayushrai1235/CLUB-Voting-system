import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Election from '../models/Election.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/voting-system';

const checkData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');

    const activeElections = await Election.find({ status: 'active' });
    console.log('Active Elections:', activeElections.length);
    activeElections.forEach(e => console.log(`- ${e.name} (${e.status})`));

    const endedElections = await Election.find({ status: 'ended' });
    console.log('Ended Elections:', endedElections.length);
    endedElections.forEach(e => console.log(`- ${e.name} (${e.status})`));

    process.exit(0);
  } catch (error) {
    console.error('Check failed:', error);
    process.exit(1);
  }
};

checkData();
