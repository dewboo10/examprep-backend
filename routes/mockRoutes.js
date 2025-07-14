console.log('✅ mockRoutes loaded');

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const MockSubmission = require('../models/mockSubmission');
const auth = require('../middleware/authMiddleware');
const mockAccess = require('../middleware/mockAccess');
const UserPerformance = require('../models/UserPerformance');
const QuestionAttempt = require('../models/QuestionAttempt');
const StudySession = require('../models/StudySession');

// ✅ POST /api/mock/submit – Save a mock test submission
router.post('/submit', auth, mockAccess, async (req, res) => {
  console.log('✅ /api/mock/submit hit');
  try {
    const { answers, reviewFlags, timeSpent, exam, day, sessionId } = req.body;
    const dayNum = parseInt(day, 10);
    if (!exam || isNaN(dayNum)) {
      return res.status(400).json({ success: false, message: "Missing or invalid exam or day" });
    }

    // ✅ [FIX #1] Prevent duplicate submissions
    const alreadySubmitted = await MockSubmission.findOne({
      userId: req.user.id,
      exam,
      day: dayNum
    });

    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: "You already submitted this mock." });
    }

    // ✅ Fetch questions for that exam and day
    const questions = await Question.find({ exam, day: dayNum });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, message: "No questions found for this exam and day." });
    }

    // ✅ Calculate scores
    let totalScore = 0;
    let totalQuestions = 0;
    const sections = [];

    // --- NEW: Track performance and attempts ---
    // Prepare a map for quick question lookup
    const questionMap = {};
    questions.forEach(q => { questionMap[q.section + '_' + q.id] = q; });

    // For each section and each answer, create QuestionAttempt and update analytics
    for (const section in answers) {
      const userAns = answers[section]; // array of selected answers (by index)
      const qList = questions
        .filter(q => q.section === section)
        .sort((a, b) => a.id - b.id); // ensure order matches

      let score = 0;
      for (let idx = 0; idx < userAns.length; idx++) {
        const ans = userAns[idx];
        const q = qList[idx];
        if (!q) continue;
        const isCorrect = ans !== null && ans === q.answerIndex;
        if (isCorrect) score++;

        // --- Create QuestionAttempt ---
        await QuestionAttempt.create({
          userId: req.user.id,
          questionId: q._id,
          exam,
          section,
          topics: q.topics || [],
          day: dayNum,
          selectedAnswer: ans,
          isCorrect,
          timeSpent: (Array.isArray(timeSpent) && timeSpent[section] && timeSpent[section][idx]) ? timeSpent[section][idx] : 0,
          sessionId: sessionId || null,
          startedAt: new Date(), // You can improve this if you track per-question start
          submittedAt: new Date()
        });

        // --- Update UserPerformance ---
        let perf = await UserPerformance.findOne({ userId: req.user.id, exam });
        if (!perf) perf = await UserPerformance.create({ userId: req.user.id, exam });
        await perf.updateQuestionAttempt({
          isCorrect,
          timeSpent: (Array.isArray(timeSpent) && timeSpent[section] && timeSpent[section][idx]) ? timeSpent[section][idx] : 0,
          section,
          topics: q.topics || [],
          questionId: q._id
        });

        // --- Update Question analytics ---
        await q.updateAnalytics({
          isCorrect,
          timeSpent: (Array.isArray(timeSpent) && timeSpent[section] && timeSpent[section][idx]) ? timeSpent[section][idx] : 0,
          wasSkipped: ans === null,
          wasFlagged: reviewFlags && reviewFlags[section] && reviewFlags[section][idx]
        });

        // --- Optionally: Update StudySession ---
        if (sessionId) {
          const session = await StudySession.findOne({ sessionId });
          if (session) {
            const questionIndex = session.questions.findIndex(qq => qq.questionId.toString() === q._id.toString());
            if (questionIndex !== -1) {
              await session.updateQuestionAttempt(questionIndex, {
                isCorrect,
                timeSpent: (Array.isArray(timeSpent) && timeSpent[section] && timeSpent[section][idx]) ? timeSpent[section][idx] : 0,
                selectedAnswer: ans,
                wasSkipped: ans === null,
                wasFlagged: reviewFlags && reviewFlags[section] && reviewFlags[section][idx],
                answerChanges: 0 // You can enhance this if you track answer changes
              });
            }
          }
        }
      }
      sections.push({ name: section, score, answers: userAns });
      totalScore += score;
      totalQuestions += qList.length;
    }

    // ✅ Save the submission (legacy, for compatibility)
    const submission = new MockSubmission({
      userId: req.user.id,
      exam,
      day: dayNum,
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
