import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getUsers,
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  getCandidates,
  approveCandidate,
  rejectCandidate,
  deleteCandidate,
  getElections,
  createElection,
  updateElection,
  deleteElection,
  getVotingStatistics
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// Get all users
router.get('/users', getUsers);

// Get all positions
router.get('/positions', getPositions);

// Create position
router.post('/positions', createPosition);

// Update position
router.put('/positions/:id', updatePosition);

// Delete position
router.delete('/positions/:id', deletePosition);

// Get all candidates
router.get('/candidates', getCandidates);

// Approve candidate
router.put('/candidates/:id/approve', approveCandidate);

// Reject candidate
router.put('/candidates/:id/reject', rejectCandidate);

// Delete candidate
router.delete('/candidates/:id', deleteCandidate);

// Get all elections
router.get('/elections', getElections);

// Create election
router.post('/elections', createElection);

// Update election
router.put('/elections/:id', updateElection);

// Delete election
router.delete('/elections/:id', deleteElection);

// Get voting statistics
router.get('/statistics', getVotingStatistics);

export default router;

