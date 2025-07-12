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
  if (exam) {
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(exam)) {
      filter.exam = exam;
    } else {
      // Try to find exam by code or name
      const Exam = require('../models/Exam');
      const examDoc = await Exam.findOne({ $or: [{ code: exam }, { name: exam }] });
      if (examDoc) filter.exam = examDoc._id;
      else filter.exam = null; // No match, will return empty
    }
  }
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
  const Exam = require('../models/Exam');
  const Mock = require('../models/Mock');
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          // Parse options (option1, option2, ... or options as JSON)
          let options = [];
          if (row.options) {
            try { options = JSON.parse(row.options); } catch { options = []; }
          } else {
            options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
          }

          // Resolve exam code to ObjectId
          let examId = row.exam;
          if (examId && !examId.match(/^[0-9a-fA-F]{24}$/)) {
            const examDoc = await Exam.findOne({ $or: [{ code: row.exam }, { name: row.exam }] });
            examId = examDoc ? examDoc._id : undefined;
          }

          // Explicitly map fields to avoid header/field issues
          const questionObj = {
            id: row.id ? row.id.trim() : undefined,
            question: row.question ? row.question.trim() : undefined,
            options,
            answerIndex: row.answerIndex ? Number(row.answerIndex) : undefined,
            explanation: row.explanation ? row.explanation.trim() : undefined,
            chapter: row.chapter ? row.chapter.trim() : undefined,
            exam: examId,
            day: row.day && row.day.trim() ? Number(row.day.trim()) : undefined,
            section: row.section && row.section.trim() ? row.section.trim() : undefined,
            type: row.type ? row.type.trim() : 'mock',
            img: row.img || null,
            passage: row.passage || null,
            video: row.video || undefined,
            videoUrl: row.videoUrl || undefined,
            videoStart: row.videoStart ? Number(row.videoStart) : undefined,
            topics: row.topics ? row.topics.split(',').map(t => t.trim()).filter(Boolean) : []
          };
          // Save question and assign to mock if mock_code is present
          const q = await Question.create(questionObj);
          // Assign to mock if mock_code is present
          if (row.mock_code) {
            const mockDoc = await Mock.findOne({ $or: [{ name: row.mock_code }, { code: row.mock_code }] });
            if (mockDoc) {
              mockDoc.questions.push(q._id);
              await mockDoc.save();
            }
          }
          results.push(q);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    fs.unlinkSync(filePath); // Clean up
    res.json({ success: true, count: results.length });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message });
  }
};
