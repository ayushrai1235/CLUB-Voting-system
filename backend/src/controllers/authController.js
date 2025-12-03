import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import stream from 'stream';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Member Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if profile photo is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'member'
    });

    // Handle file upload to Cloudinary
    if (req.file) {
      try {
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'voting-system',
              allowed_formats: ['jpg', 'png', 'jpeg'],
              transformation: [{ width: 500, height: 500, crop: 'limit' }]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          const bufferStream = new stream.PassThrough();
          bufferStream.end(req.file.buffer);
          bufferStream.pipe(uploadStream);
        });

        const result = await uploadPromise;
        user.profilePhoto = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Error uploading profile photo', error: uploadError.message });
      }
    } else {
       return res.status(400).json({ message: 'Profile photo is required' });
    }

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
};

// Member Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if email matches admin email
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Find or create admin user
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    
    if (!admin) {
      // Create admin user if doesn't exist (first time setup)
      admin = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        password: password, // Will be hashed by pre-save hook
        profilePhoto: 'https://ui-avatars.com/api/?name=Admin&background=random', // Default admin image
        role: 'admin'
      });
      await admin.save();
    } else {
      // Verify password
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    const token = generateToken(admin._id);

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login', error: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePhoto: req.user.profilePhoto,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
