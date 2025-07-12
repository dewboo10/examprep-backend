const express = require('express');
const { upgradeTier, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/admin');

const router = express.Router();

// Route to upgrade user tier
router.post('/upgrade', authMiddleware, upgradeTier);

// Route to get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user info' });
  }
});

// Admin: List all users
router.get('/users', adminAuth, getAllUsers);

module.exports = router; 