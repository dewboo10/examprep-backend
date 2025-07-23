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

// DELETE /api/comments/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only allow the comment owner or admin to delete
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

module.exports = router; 