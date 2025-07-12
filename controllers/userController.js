const User = require('../models/User');

// Upgrade user tier controller
exports.upgradeTier = async (req, res) => {
  try {
    const { tier } = req.body; // 'mid' or 'premium'
    if (!['mid', 'premium'].includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier' });
    }

    const update = { tier };
    if (tier === 'premium') {
      // Set expiry to 1 year from now (customize as needed)
      update.premiumExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    } else {
      update.premiumExpiry = null;
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ message: 'Tier upgraded', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email tier createdAt lastLogin');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}; 