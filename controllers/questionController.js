const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  const { exam, day } = req.query;
  if (!exam || !day) {
    return res.status(400).json({ message: 'Please provide exam and day' });
  }
  // Fetch from DB
  const questions = await Question.find({ exam, day });
  // Group by section:
  const grouped = questions.reduce((acc, q) => {
    (acc[q.section] = acc[q.section] || []).push(q);
    return acc;
  }, {});
  res.json(grouped);
};
