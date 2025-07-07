const express = require('express');
const { upgradeTier } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to upgrade user tier
router.post('/upgrade', authMiddleware, upgradeTier);

module.exports = router; 