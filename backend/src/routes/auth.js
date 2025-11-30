import express from 'express';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { signup, login, adminLogin, getMe } from '../controllers/authController.js';

const router = express.Router();

// Member Signup
router.post('/signup', upload.single('profilePhoto'), signup);

// Member Login
router.post('/login', login);

// Admin Login
router.post('/admin-login', adminLogin);

// Get current user
router.get('/me', authenticate, getMe);

export default router;

