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

// Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Admin: Update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, tier, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }
    const update = { name, email };
    if (tier) update.tier = tier;
    if (status) update.status = status;
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// Admin: Partially update a user (PATCH)
exports.patchUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const update = {};
    const allowedFields = ['name', 'email', 'tier', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    // If email is being changed, check for uniqueness
    if (update.email) {
      const existingUser = await User.findOne({ email: update.email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken by another user' });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
}; 