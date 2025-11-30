import express from 'express';
import {
  getAllElections,
  getActiveElection,
  getElectionById,
  getLatestEndedElection
} from '../controllers/electionController.js';

const router = express.Router();

// Get all elections
router.get('/', getAllElections);

// Get active election
router.get('/active', getActiveElection);

// Get latest ended election
router.get('/ended/latest', getLatestEndedElection);

// Get single election
router.get('/:id', getElectionById);

export default router;

