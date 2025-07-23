const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../models/Comment');

// GET /api/questions?exam=CAT&day=1
router.get('/', (req, res, next) => { console.log('[ROUTE] /api/questions'); next(); }, questionController.getQuestions);
router.get('/topic/:topic', (req, res, next) => { console.log('[ROUTE] /api/questions/topic/:topic'); next(); }, questionController.getQuestionsByTopic);

// GET /api/questions/:id/analytics - Fetch analytics for a specific question
router.get('/:id/analytics', async (req, res) => {
  try {
    const question = await require('../models/Question').findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({
      correctCount: question.analytics?.correctAttempts || 0,
      totalAttempts: question.analytics?.totalAttempts || 0,
      optionCounts: question.analytics?.optionCounts || [],
      averageTimeSpent: question.analytics?.averageTimeSpent || 0,
      successRate: question.analytics?.successRate || 0,
      difficulty: question.analytics?.difficulty || null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/comments/all (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  try {
    const comments = await Comment.find().populate('userId', 'name email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Allow only the comment owner or admin to delete
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

// console.log(localStorage.getItem('user'));

module.exports = router;
