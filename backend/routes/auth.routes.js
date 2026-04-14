// backend/routes/auth.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Validation middleware
const validateRegister = [
  body('name').trim().isLength({ min: 2 }).escape().withMessage('Name is required (min 2 chars)'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password min 8 chars, upper, lower, number, symbol'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }
];

const validateProfile = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).escape(),
  body('bio').optional().trim().isLength({ max: 500 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }
];

const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('New password min 8 chars, upper, lower, number, symbol'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }
];

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    if (user.status === 'inactive') return res.status(403).json({ message: 'Your account is deactivated. Please contact the admin.' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });
    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, bio: user.bio, profilePic: user.profilePic }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// ── PUT /api/auth/profile ─────────────────────────────────────
router.put('/profile', protect, upload.single('profilePic'), validateProfile, (req, res, next) => {
  // Handle multer errors (file type/size rejection)
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError.message });
  }
  next();
}, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.file) user.profilePic = req.file.filename;
    await user.save();
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// ── PUT /api/auth/change-password ────────────────────────────
router.put('/change-password', protect, validateChangePassword, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(currentPassword);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

