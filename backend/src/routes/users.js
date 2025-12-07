import express from 'express';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { updateProfilePhoto } from '../controllers/userController.js';

const router = express.Router();

// Update profile photo
router.put('/profile-photo', authenticate, upload.single('profilePhoto'), updateProfilePhoto);

export default router;
