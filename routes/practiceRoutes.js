const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const practiceController = require('../controllers/practiceController');

// POST /api/practice/attempt
router.post('/attempt', (req, res, next) => { console.log('[ROUTE] /api/practice/attempt'); next(); }, auth, practiceController.attemptPracticeQuestion);

module.exports = router; 