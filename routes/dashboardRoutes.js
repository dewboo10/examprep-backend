const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');


const {
  getUserInfo,
  getQuizSummary,
  getRecentQuizzes,
  getSectionStats
} = require('../controllers/dashboardController');

router.get('/user', auth, getUserInfo);
router.get('/quiz-summary', auth, getQuizSummary);
router.get('/recent-quizzes', auth, getRecentQuizzes);
router.get('/section-stats', auth, getSectionStats);

module.exports = router;
