const Question = require('../models/Question');
const csv = require('csv-parser');
const fs = require('fs');

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

// Admin: List all questions (optionally filter by exam, day, section)
exports.getAllQuestions = async (req, res) => {
  const { exam, day, section } = req.query;
  const filter = {};
  if (exam) filter.exam = exam;
  if (day) filter.day = Number(day);
  if (section) filter.section = section;
  const questions = await Question.find(filter);
  res.json(questions);
};

// Admin: Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update a question by ID
exports.updateQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Upload questions via CSV
exports.uploadQuestionsCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const results = [];
  const filePath = req.file.path;
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Parse options (option1, option2, ... or options as JSON)
          let options = [];
          if (row.options) {
            try { options = JSON.parse(row.options); } catch { options = []; }
          } else {
            options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
          }
          results.push({
            exam: row.exam,
            day: Number(row.day),
            section: row.section,
            id: row.id || undefined,
            img: row.img || null,
            passage: row.passage || null,
            question: row.question,
            options,
            answerIndex: Number(row.answerIndex),
            explanation: row.explanation,
            video: row.video || undefined,
            videoUrl: row.videoUrl || undefined,
            videoStart: row.videoStart ? Number(row.videoStart) : undefined,
            type: row.type || 'mock',
            chapter: row.chapter || undefined
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });
    // Bulk insert
    const inserted = await Question.insertMany(results);
    fs.unlinkSync(filePath); // Clean up
    res.json({ success: true, count: inserted.length });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message });
  }
};
