import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getElectionResults,
  getResultsSummary,
  exportResults
} from '../controllers/resultController.js';

const router = express.Router();

// Get results for an election (only if ended)
router.get('/election/:electionId', getElectionResults);

// Get results summary (admin only - can see before election ends)
router.get('/summary/:electionId', authenticate, getResultsSummary);

// Export results as CSV (admin only)
router.get('/export/:electionId', authenticate, exportResults);

export default router;

