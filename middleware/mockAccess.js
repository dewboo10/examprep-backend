const User = require('../models/User');

// Middleware to restrict mock access based on user tier
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const { exam, day } = req.body; // expects exam and day in request body
    const dayNum = parseInt(day, 10);

    if (!exam || isNaN(dayNum)) {
      return res.status(400).json({ message: 'Missing or invalid exam or day' });
    }

    // Check if premium has expired
    if (user.tier === 'premium' && user.premiumExpiry && user.premiumExpiry < new Date()) {
      user.tier = 'free';
      user.premiumExpiry = null;
      await user.save();
    }

    let allowedMocks = 3; // default for free
    if (user.tier === 'mid') allowedMocks = 15;
    if (user.tier === 'premium') allowedMocks = Infinity;

    if (dayNum > allowedMocks) {
      return res.status(403).json({ message: 'Upgrade required to access this mock.' });
    }

    next();
  } catch (err) {
    console.error('mockAccess error:', err);
    res.status(500).json({ message: 'Server error in access control.' });
  }
}; 