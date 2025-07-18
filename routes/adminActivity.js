const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const adminAuth = require('../middleware/admin');
const auth = require('../middleware/authMiddleware');

// GET /api/admin/activity - Get admin activity
router.get('/activity', auth, adminAuth, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin activity'
    });
  }
});

// GET /api/admin/activity - Get admin activity
router.get('/', auth, adminAuth, async (req, res) => {
  // Example: return recent admin activity or a placeholder
  res.json({ message: 'Admin activity endpoint is working!' });
});

// Helper function to log admin activity
async function logAdminActivity(type, adminId, adminName, title, description, details = {}) {
  try {
    await Activity.create({
      type,
      adminId,
      adminName,
      title,
      description,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging admin activity:', error);
  }
}

module.exports = router; 