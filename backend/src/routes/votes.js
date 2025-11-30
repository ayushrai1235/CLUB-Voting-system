import express from 'express';
import { authenticate, isMember } from '../middleware/auth.js';
import {
  castVote,
  checkVote,
  getMyVotes
} from '../controllers/voteController.js';

const router = express.Router();

// Member: Submit vote
router.post('/cast', authenticate, isMember, castVote);

// Member: Check if user has voted for a position
router.get('/check/:electionId/:positionId', authenticate, isMember, checkVote);

// Member: Get user's votes
router.get('/my-votes', authenticate, isMember, getMyVotes);

export default router;

