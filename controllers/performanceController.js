const MockSubmission = require('../models/mockSubmission');

exports.getPerformanceStats = async (req, res) => {
  try {
    const userId = req.userId;
    const submissions = await MockSubmission.find({ userId }).sort({ submittedAt: -1 });

    if (!submissions.length) {
      return res.json({
        success: true,
        data: {
          totalQuizzes: 0,
          totalScore: 0,
          totalTime: 0,
          avgAccuracy: 0,
          percentile: 0,
          sectionScores: {},
          sectionAverages: {},
          bestSection: null,
          worstSection: null,
          recent: []
        }
      });
    }

    const totalQuizzes = submissions.length;
    const totalScore = submissions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const totalTime = submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);

    // Average Accuracy
    const totalAccuracy = submissions.reduce((sum, s) => {
      const sectionAccuracy = s.sections?.reduce((acc, sec) => acc + (sec.accuracy || 0), 0) || 0;
      return sum + sectionAccuracy / (s.sections?.length || 1);
    }, 0);
    const avgAccuracy = totalAccuracy / totalQuizzes;

    // Section-wise aggregation
    const sectionTotals = {};
    const sectionCounts = {};
    const sectionAcc = {};

    submissions.forEach(sub => {
      sub.sections?.forEach(sec => {
        const name = sec.name;
        sectionTotals[name] = (sectionTotals[name] || 0) + (sec.score || 0);
        sectionCounts[name] = (sectionCounts[name] || 0) + 1;
        sectionAcc[name] = (sectionAcc[name] || 0) + (sec.accuracy || 0);
      });
    });

    const sectionScores = {};
    const sectionAverages = {};
    const sectionAccuracies = {};

    for (const name in sectionTotals) {
      sectionScores[name] = Number((sectionTotals[name]).toFixed(2));
      sectionAverages[name] = Number((sectionTotals[name] / sectionCounts[name]).toFixed(2));
      sectionAccuracies[name] = Number((sectionAcc[name] / sectionCounts[name]).toFixed(2));
    }

    // Determine best and worst section by score
    let bestSection = null, worstSection = null;
    let maxScore = -Infinity, minScore = Infinity;

    for (const name in sectionScores) {
      if (sectionScores[name] > maxScore) {
        maxScore = sectionScores[name];
        bestSection = name;
      }
      if (sectionScores[name] < minScore) {
        minScore = sectionScores[name];
        worstSection = name;
      }
    }

    // Predicted percentile (basic logic, can be replaced with ML later)
    const percentile = Math.min(100, Math.max(0, Math.round((avgAccuracy / 100) * 95 + 5)));

    // Recent activity
    const recent = submissions.slice(0, 5).map(sub => ({
      test: `${sub.exam} - Day ${sub.day}`,
      totalScore: sub.totalScore,
      timeSpent: sub.timeSpent,
      date: sub.submittedAt
    }));

    res.json({
      success: true,
      data: {
        totalQuizzes,
        totalScore,
        totalTime,
        avgAccuracy: Number(avgAccuracy.toFixed(2)),
        percentile,
        sectionScores,
        sectionAverages,
        sectionAccuracies,
        bestSection,
        worstSection,
        recent
      }
    });
  } catch (err) {
    console.error("Performance fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.resetPerformance = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await MockSubmission.deleteMany({ userId });

    res.json({ success: true, message: "Performance reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ success: false, message: "Reset failed" });
  }
};
