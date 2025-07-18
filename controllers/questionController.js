const Question = require('../models/Question');
const csv = require('csv-parser');
const fs = require('fs');
const TopicSection = require('../models/TopicSection');
const streamifier = require('streamifier');
const crypto = require('crypto');

exports.getQuestions = async (req, res) => {
  res.set('Cache-Control', 'no-store');
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
  const Exam = require('../models/Exam');
  const Mock = require('../models/Mock');
  const TopicSection = require('../models/TopicSection');
  const filePath = req.file.path;
  let fileContent = fs.readFileSync(filePath, 'utf8');
  if (fileContent.charCodeAt(0) === 0xFEFF) fileContent = fileContent.slice(1);

  const questions = [];
  const errors = [];
  const uniqueSet = new Set();

  await new Promise((resolve, reject) => {
    streamifier.createReadStream(fileContent)
      .pipe(csv())
      .on('data', row => questions.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log('CSV parsed, number of rows:', questions.length);
  console.log('Errors collected:', errors.length);

  // --- Progress Tracking ---
  if (!global.uploadProgress) global.uploadProgress = {};
  const uploadId = crypto.randomBytes(8).toString('hex') + Date.now();
  global.uploadProgress[uploadId] = {
    total: questions.length,
    current: 0,
    status: 'processing',
    errors: [],
    startedAt: new Date().toISOString(),
    file: req.file?.originalname || null
  };

  // Respond immediately with uploadId so frontend can poll
  res.json({ uploadId });

  // Process in background
  (async () => {
    const toInsert = [];
    for (let i = 0; i < questions.length; i++) {
      if (i % 50 === 0) console.log(`Processing row ${i + 1} of ${questions.length}`);
      global.uploadProgress[uploadId].current = i + 1;
      const row = questions[i];
      try { // Add try/catch for each row
        // Check for empty exam field
        let examId = row.exam;
        if (!examId || !examId.trim()) {
          errors.push(`Row ${i + 1}: Exam field is empty`);
          global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Exam field is empty`);
          continue;
        }
        if (examId && !examId.match(/^[0-9a-fA-F]{24}$/)) {
          const examDoc = await Exam.findOne({ $or: [{ code: row.exam }, { name: row.exam }] });
          if (examDoc) {
            examId = examDoc._id;
          } else {
            errors.push(`Row ${i + 1}: Exam code or name "${row.exam}" not found in database`);
            global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Exam code or name "${row.exam}" not found in database`);
            continue;
          }
        }
        // Compose unique key for duplicate check (use examId)
        const key = `${examId}-${row.day}-${row.section}-${row.id}`;
        if (uniqueSet.has(key)) {
          errors.push(`Row ${i + 1}: Duplicate in CSV: ${key}`);
          global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Duplicate in CSV: ${key}`);
          continue;
        } else {
          uniqueSet.add(key);
        }
        // Check for duplicates in DB (use examId)
        const exists = await Question.findOne({ exam: examId, day: row.day, section: row.section, id: row.id });
        if (exists) {
          errors.push(`Row ${i + 1}: Duplicate in DB: ${key}`);
          global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Duplicate in DB: ${key}`);
          continue;
        }
        // Validate and cast day
        let day = row.day;
        if (day && typeof day === 'string') {
          day = day.trim();
          if (day && !isNaN(day)) day = Number(day);
          else day = undefined;
        }
        // Validate and cast answerIndex
        let answerIndex = row.answerIndex;
        if (answerIndex && typeof answerIndex === 'string') {
          answerIndex = answerIndex.trim();
          if (answerIndex && !isNaN(answerIndex)) answerIndex = Number(answerIndex);
          else answerIndex = undefined;
        }
        // Parse options
        let options = [];
        if (row.options) {
          try { options = JSON.parse(row.options); } catch { options = []; }
        } else {
          options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
        }
        // Parse and normalize topics, section, difficulty, and level
        let topics = row.topics ? row.topics.split(',').map(t => t.trim()) : [];
        topics = topics.filter(Boolean);
        let section = row.section && row.section.trim() ? row.section.trim() : undefined;
        let difficulty = row.difficulty ? row.difficulty.trim().toLowerCase() : undefined;
        let level = row.level ? row.level.trim().toLowerCase() : undefined;
        const type = row.type ? row.type.trim() : 'mock';
        if (topics.length === 0 && section) topics = [section];
        // Validate required fields
        if (!row.id || !row.question || !examId || topics.length === 0 || !level) {
          errors.push(`Row ${i + 1}: Missing required fields (id, question, exam, topics, or level)`);
          global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Missing required fields (id, question, exam, topics, or level)`);
          continue;
        }
        if (type === 'mock') {
          if (!section) {
            errors.push(`Row ${i + 1}: Section is required for mock questions`);
            global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Section is required for mock questions`);
            continue;
          }
          if (!row.mock_code) {
            errors.push(`Row ${i + 1}: mock_code is required for mock questions`);
            global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: mock_code is required for mock questions`);
            continue;
          }
        }
        // Auto-create TopicSection and add section if not present
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
        // Build question object
        const questionObj = {
          id: row.id ? row.id.trim() : undefined,
          question: row.question ? row.question.trim() : undefined,
          options,
          answerIndex,
          explanation: row.explanation ? row.explanation.trim() : undefined,
          chapter: row.chapter ? row.chapter.trim() : undefined,
          exam: examId,
          day,
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
        toInsert.push(questionObj);
      } catch (rowError) {
        errors.push(`Row ${i + 1}: Processing error: ${rowError.message}`);
        global.uploadProgress[uploadId].errors.push(`Row ${i + 1}: Processing error: ${rowError.message}`);
        console.error(`Error processing row ${i + 1}:`, rowError);
      }
    }

    console.log('Questions to insert:', toInsert.length);
    global.uploadProgress[uploadId].toInsert = toInsert.length;

    if (errors.length > 0) {
      console.log('CSV upload errors:', errors);
      global.uploadProgress[uploadId].status = 'error';
      global.uploadProgress[uploadId].errors = errors;
      fs.unlinkSync(filePath);
      return;
    }

    // If all good, insert all questions with a timeout and more logging
    try {
      console.log('Inserting questions into DB...');
      global.uploadProgress[uploadId].status = 'inserting';
      const insertPromise = Question.insertMany(toInsert, { ordered: false });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Insert timed out')), 20000));
      const result = await Promise.race([insertPromise, timeoutPromise]);
      console.log('InsertMany result:', result.length, 'documents inserted');
      global.uploadProgress[uploadId].status = 'done';
      global.uploadProgress[uploadId].inserted = result.length;
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('InsertMany error:', err);
      global.uploadProgress[uploadId].status = 'error';
      global.uploadProgress[uploadId].error = err.message;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  })();
};

// Endpoint to get upload progress
exports.getUploadProgress = (req, res) => {
  const uploadId = req.params.uploadId;
  if (!global.uploadProgress || !global.uploadProgress[uploadId]) {
    return res.status(404).json({ error: 'Upload not found' });
  }
  res.json(global.uploadProgress[uploadId]);
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
