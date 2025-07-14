const Question = require('../models/Question');
const csv = require('csv-parser');
const fs = require('fs');
const TopicSection = require('../models/TopicSection');

exports.getQuestions = async (req, res) => {
  console.log('[API] GET /api/questions', req.query);
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
  console.log('[API] GET /api/questions/all', req.query);
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
  console.log('[API] POST /api/questions (create)', req.body);
  try {
    const q = await Question.create(req.body);
    console.log('[DB] Question created:', q._id);
    res.status(201).json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update a question by ID
exports.updateQuestion = async (req, res) => {
  console.log('[API] PUT /api/questions/:id (update)', req.params, req.body);
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Question not found' });
    console.log('[DB] Question updated:', q._id);
    res.json(q);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete a question by ID
exports.deleteQuestion = async (req, res) => {
  console.log('[API] DELETE /api/questions/:id (delete)', req.params);
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    console.log('[DB] Question deleted:', q._id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Upload questions via CSV
exports.uploadQuestionsCSV = async (req, res) => {
  console.log('[API] POST /api/questions/upload (CSV upload)', req.file);
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const results = [];
  const filePath = req.file.path;
  const Exam = require('../models/Exam');
  const Mock = require('../models/Mock');
  let errorOccurred = false;
  let errorMessage = '';
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
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

            // --- Parse and normalize topics, section, difficulty, and level ---
            let topics = row.topics ? row.topics.split(',').map(t => t.trim()) : [];
            topics = topics.filter(Boolean);
            let section = row.section && row.section.trim() ? row.section.trim() : undefined;
            let difficulty = row.difficulty ? row.difficulty.trim().toLowerCase() : undefined;
            let level = row.level ? row.level.trim().toLowerCase() : undefined;
            const type = row.type ? row.type.trim() : 'mock';

            // If topics missing but section present, optionally map section to topic (customize as needed)
            if (topics.length === 0 && section) {
              topics = [section]; // Or use a mapping if you want to map section to a specific topic
            }

            // --- Validation ---
            if (!row.id || !row.question || !examId || topics.length === 0 || !level) {
              throw new Error('Missing required fields: id, question, exam, topics, or level');
            }
            if (type === 'mock' && !section) {
              throw new Error('Section is required for mock questions');
            }

            // --- Auto-create TopicSection and add section if not present ---
            for (const topic of topics) {
              let topicDoc = await TopicSection.findOne({ topic });
              if (!topicDoc) {
                topicDoc = await TopicSection.create({ topic, sections: section ? [section] : [] });
              } else if (section && !topicDoc.sections.includes(section)) {
                topicDoc.sections.push(section);
                topicDoc.updatedAt = new Date();
                await topicDoc.save();
              }
            }

            // --- Build question object ---
            const questionObj = {
              id: row.id ? row.id.trim() : undefined,
              question: row.question ? row.question.trim() : undefined,
              options,
              answerIndex: row.answerIndex ? Number(row.answerIndex) : undefined,
              explanation: row.explanation ? row.explanation.trim() : undefined,
              chapter: row.chapter ? row.chapter.trim() : undefined,
              exam: examId,
              day: row.day && row.day.trim() ? Number(row.day.trim()) : undefined,
              section,
              type,
              img: row.img || null,
              passage: row.passage || null,
              video: row.video || undefined,
              videoUrl: row.videoUrl || undefined,
              videoStart: row.videoStart ? Number(row.videoStart) : undefined,
              topics,
              metadata: {
                ...((row.metadata && typeof row.metadata === 'object') ? row.metadata : {}),
                level
              },
              ...(difficulty ? { difficulty } : {})
            };
            const q = await Question.create(questionObj);
            if (row.mock_code) {
              const mockDoc = await Mock.findOne({ $or: [{ name: row.mock_code }, { code: row.mock_code }] });
              if (mockDoc) {
                mockDoc.questions.push(q._id);
                await mockDoc.save();
              }
            }
            results.push(q);
          } catch (err) {
            errorOccurred = true;
            errorMessage = err.message;
            reject(new Error('Row error: ' + err.message));
          }
        })
        .on('end', resolve)
        .on('error', (err) => {
          errorOccurred = true;
          errorMessage = err.message;
          reject(new Error('CSV parsing error: ' + err.message));
        });
    });
    fs.unlinkSync(filePath); // Clean up
    if (!errorOccurred) console.log('[DB] CSV upload success, count:', results.length);
    else console.log('[DB] CSV upload error:', errorMessage);
    if (errorOccurred) {
      return res.status(400).json({ message: errorMessage || 'CSV file contained errors.' });
    }
    res.json({ success: true, count: results.length });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(400).json({ message: err.message || 'Failed to process CSV file.' });
  }
};

// GET /api/questions/topic/:topic?level=...&difficulty=...
exports.getQuestionsByTopic = async (req, res) => {
  console.log('[API] GET /api/questions/topic/:topic', req.params, req.query);
  try {
    const { level, difficulty } = req.query;
    const topic = req.params.topic;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });
    const filter = { topics: topic };
    if (level) filter['metadata.level'] = level;
    if (difficulty) filter.difficulty = difficulty;
    const questions = await Question.find(filter);
    console.log('[DB] Questions fetched for topic:', req.params.topic, 'Count:', questions.length);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
