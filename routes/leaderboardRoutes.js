const router = require('express').Router();
const MockSubmission = require('../models/mockSubmission');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/leaderboard/overall
router.get('/overall', authMiddleware, async (req, res) => {
  try {
    const leaderboardData = await MockSubmission.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          attempts: { $sum: 1 },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name: '$userInfo.name',
          averageScore: { $divide: ['$totalScore', '$attempts'] },
          attempts: 1
        }
      },
      { $sort: { averageScore: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, leaderboard: leaderboardData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
