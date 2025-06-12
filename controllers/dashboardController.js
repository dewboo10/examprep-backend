const User = require('../models/User');
const MockSubmission = require('../models/mockSubmission');
const sendOTPEmail = require('../utils/mailer');




// GET /api/dashboard/user
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, email: user.email });
  } catch (err) {
    console.error('❌ Error fetching user info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/dashboard/quiz-summary
exports.getQuizSummary = async (req, res) => {
  try {
    const submissions = await MockSubmission.find({ userId: req.userId });

    const completed = submissions.length;
    const totalScore = submissions.reduce((sum, s) => sum + s.totalScore, 0);
    const totalQuestions = submissions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const timeSpent = submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const accuracy = totalQuestions ? ((totalScore / totalQuestions) * 100).toFixed(2) : 0;

    const user = await User.findById(req.userId);

    res.json({
      completed,
      accuracy,
      streak: user?.streak || 0,
      timeSpent
    });
  } catch (err) {
    console.error('getQuizSummary error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// GET /api/dashboard/recent-quizzes
// 🧠 Controller: GET /api/dashboard/recent-quizzes
exports.getRecentQuizzes = async (req, res) => {
  try {
    const userId = req.userId; // ✅ AuthMiddleware attaches this

    // 🔍 Fetch last 5 submissions for the user, newest first
    const recent = await MockSubmission.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean(); // returns plain objects for better performance

    // 🧹 Optional: Format dates or fields if needed
    const quizzes = recent.map((quiz) => ({
      exam: quiz.exam,
      day: quiz.day,
      totalQuestions: quiz.totalQuestions,
      totalScore: quiz.totalScore,
      submittedAt: quiz.submittedAt,
    }));

    res.json({ quizzes });
  } catch (err) {
    console.error('❌ getRecentQuizzes error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// In-memory OTP store (in production, use Redis or DB)
const otpStore = {};

// ✅ GET /api/dashboard/section-stats
exports.getSectionStats = async (req, res) => {
  try {
    const submissions = await MockSubmission.find({ userId: req.userId });

    const sectionStats = {
      Quant: { correct: 0, total: 0 },
      VARC: { correct: 0, total: 0 },
      LRDI: { correct: 0, total: 0 }
    };

    submissions.forEach(sub => {
      sub.sections.forEach(sec => {
        const sectionName = sec.name;
        const correct = sec.score || 0;
        const total = sec.answers?.length || 0;

        if (sectionStats[sectionName]) {
          sectionStats[sectionName].correct += correct;
          sectionStats[sectionName].total += total;
        }
      });
    });

    const result = {};
    for (const key in sectionStats) {
      const { correct, total } = sectionStats[key];
      result[key] = {
        correct,
        total,
        accuracy: total > 0 ? ((correct / total) * 100).toFixed(2) : '0.00'
      };
    }

    res.json(result);
  } catch (err) {
    console.error('❌ Error fetching section stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent successfully to email' });
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
};
