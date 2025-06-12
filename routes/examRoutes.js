const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getExams, selectExam } = require('../controllers/examController');

router.get('/', getExams);                // Public
router.post('/select', auth, selectExam); // Protected

module.exports = router;
