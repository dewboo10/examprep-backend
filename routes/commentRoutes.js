const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/comments?questionId=...
router.get('/', async (req, res) => {
  const { questionId } = req.query;
  if (!questionId) {
    return res.status(400).json({ error: 'questionId is required' });
  }
  try {
    const comments = await Comment.find({ questionId }).populate('userId', 'name avatar').sort({ timestamp: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments
router.post('/', authMiddleware, async (req, res) => {
  const { questionId, text, type } = req.body;
  if (!questionId || !text) {
    return res.status(400).json({ error: 'questionId and text are required' });
  }
  try {
    const comment = new Comment({
      questionId,
      userId: req.user.id,
      text,
      type: type || 'comment'
    });
    await comment.save();
    await comment.populate('userId', 'name avatar');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router; 