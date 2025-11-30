import express from 'express';
import { authenticate, isMember } from '../middleware/auth.js';
import {
  getCandidatesByPosition,
  getApprovedCandidates,
  applyForPosition,
  getMyApplications
} from '../controllers/candidateController.js';

const router = express.Router();

// Get all approved candidates for a position
router.get('/position/:positionId', getCandidatesByPosition);

// Get all approved candidates (for voting page)
router.get('/approved', getApprovedCandidates);

// Member: Apply as candidate
router.post('/apply', authenticate, isMember, applyForPosition);

// Member: Get own applications
router.get('/my-applications', authenticate, isMember, getMyApplications);

export default router;

