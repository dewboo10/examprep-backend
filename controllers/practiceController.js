const Question = require('../models/Question');
const QuestionAttempt = require('../models/QuestionAttempt');
const UserPerformance = require('../models/UserPerformance');
const StudySession = require('../models/StudySession');

// POST /api/practice/attempt
// Body: { questionId, selectedAnswer, timeSpent, sessionId (optional) }
exports.attemptPracticeQuestion = async (req, res) => {
  console.log('[API] POST /api/practice/attempt', req.body);
  try {
    const userId = req.user.id;
    const { questionId, selectedAnswer, timeSpent, sessionId } = req.body;
    if (!questionId || selectedAnswer === undefined) {
      return res.status(400).json({ success: false, message: 'Missing questionId or selectedAnswer' });
    }

    // Fetch question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isCorrect = selectedAnswer === question.answerIndex;
    const section = question.section || 'General';
    const topics = question.topics || [];
    const exam = question.exam;
    const day = question.day;

    // 1. Create QuestionAttempt
    await QuestionAttempt.create({
      userId,
      questionId,
      exam,
      section,
      topics,
      day,
      selectedAnswer,
      isCorrect,
      timeSpent: timeSpent || 0,
      sessionId: sessionId || null,
      startedAt: new Date(),
      submittedAt: new Date()
    });
    console.log('[DB] Practice attempt tracked for user:', userId, 'question:', questionId);

    // 2. Update UserPerformance
    let perf = await UserPerformance.findOne({ userId, exam });
    if (!perf) perf = await UserPerformance.create({ userId, exam });
    await perf.updateQuestionAttempt({
      isCorrect,
      timeSpent: timeSpent || 0,
      section,
      topics,
      questionId
    });

    // 3. Update Question analytics (including option distribution)
    // Option distribution: how many users chose each option
    if (!question.analytics.optionCounts) {
      question.analytics.optionCounts = Array.isArray(question.options) ? Array(question.options.length).fill(0) : [];
    }
    if (selectedAnswer !== null && selectedAnswer >= 0 && selectedAnswer < question.analytics.optionCounts.length) {
      question.analytics.optionCounts[selectedAnswer] = (question.analytics.optionCounts[selectedAnswer] || 0) + 1;
    }
    await question.updateAnalytics({
      isCorrect,
      timeSpent: timeSpent || 0,
      wasSkipped: selectedAnswer === null,
      wasFlagged: false
    });
    await question.save();

    // 4. Optionally update StudySession
    if (sessionId) {
      const session = await StudySession.findOne({ sessionId });
      if (session) {
        const questionIndex = session.questions.findIndex(q => q.questionId.toString() === questionId);
        if (questionIndex !== -1) {
          await session.updateQuestionAttempt(questionIndex, {
            isCorrect,
            timeSpent: timeSpent || 0,
            selectedAnswer,
            wasSkipped: selectedAnswer === null,
            wasFlagged: false,
            answerChanges: 0
          });
        }
      }
    }

    // 5. Return updated analytics for this question
    console.log('[API] Response sent for practice attempt:', questionId);
    res.json({
      success: true,
      isCorrect,
      optionCounts: question.analytics.optionCounts,
      totalAttempts: question.analytics.totalAttempts,
      correctAttempts: question.analytics.correctAttempts,
      averageTimeSpent: question.analytics.averageTimeSpent,
      successRate: question.analytics.successRate,
      difficulty: question.analytics.difficulty
    });
  } catch (err) {
    console.error('❌ Practice attempt error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}; 