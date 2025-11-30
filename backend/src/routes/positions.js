import express from 'express';
import {
  getAllPositions,
  getElectedPositions,
  getFixedPositions,
  getPositionById
} from '../controllers/positionController.js';

const router = express.Router();

// Get all positions (public)
router.get('/', getAllPositions);

// Get elected positions only
router.get('/elected', getElectedPositions);

// Get fixed positions only
router.get('/fixed', getFixedPositions);

// Get single position
router.get('/:id', getPositionById);

export default router;

