console.log('✅ mockRoutes loaded');

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const MockSubmission = require('../models/mockSubmission');
const auth = require('../middleware/authMiddleware');

// ✅ POST /api/mock/submit – Save a mock test submission
router.post('/submit', auth, async (req, res) => {
  console.log('✅ /api/mock/submit hit');
  try {
    const { answers, reviewFlags, timeSpent, exam, day } = req.body;

    // ✅ [FIX #1] Prevent duplicate submissions
    const alreadySubmitted = await MockSubmission.findOne({
      userId: req.user.id,
      exam,
      day
    });

    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: "You already submitted this mock." });
    }

    // ✅ Fetch questions for that exam and day
    const questions = await Question.find({ exam, day });

    // ✅ Calculate scores
    let totalScore = 0;
    let totalQuestions = 0;
    const sections = [];

    for (const section in answers) {
      const userAns = answers[section]; // array of selected answers (by index)
      const qList = questions
        .filter(q => q.section === section)
        .sort((a, b) => a.id - b.id); // ensure order matches

      let score = 0;
      userAns.forEach((ans, idx) => {
        if (ans !== null && qList[idx] && ans === qList[idx].answerIndex) {
          score++;
        }
      });

      sections.push({ name: section, score, answers: userAns });
      totalScore += score;
      totalQuestions += qList.length;
    }

    // ✅ Save the submission
    const submission = new MockSubmission({
      userId: req.user.id,
      exam,
      day,
      answers,
      reviewFlags,
      timeSpent,
      totalQuestions,
      totalScore,
      sections
    });

    await submission.save();

    res.json({
      success: true,
      id: submission._id,
      score: totalScore,
      totalQuestions,
      sections
    });
  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET /api/mock – Get all submissions for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const mocks = await MockSubmission.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, mocks });
  } catch (err) {
    console.error("❌ Fetch mocks error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

// ✅ NEW: GET /api/mock/review?exam=CAT&day=1 → Get specific submission for review
router.get('/review', auth, async (req, res) => {
  const exam = req.query.exam?.toUpperCase();
  const day = parseInt(req.query.day);
  const userId = req.user.id;

  console.log("🔍 Review Request Received");
  console.log("➡ Exam:", exam);
  console.log("➡ Day:", day);
  console.log("➡ User ID:", userId);

  if (!exam || isNaN(day)) {
    console.log("❌ Invalid query");
    return res.status(400).json({ success: false, message: "Missing or invalid exam or day" });
  }

  try {
    const submission = await MockSubmission.findOne({ userId, exam, day });
    console.log("📦 Found submission:", submission);

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    res.json({ success: true, submission });
  } catch (err) {
    console.error("❌ Review fetch error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
