const Mock = require('../models/Mock');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');

// List all mocks (with optional filters)
exports.getMocks = async (req, res) => {
  try {
    const { exam, day, status, search } = req.query;
    const filter = {};
    if (exam) filter.exam = exam; // exam should be ObjectId
    if (day) filter.day = Number(day);
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const mocks = await Mock.find(filter).populate('questions').populate('exam');
    res.json(mocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new mock
exports.createMock = async (req, res) => {
  try {
    // Validate exam exists
    const exam = await Exam.findById(req.body.exam);
    if (!exam) return res.status(400).json({ message: 'Invalid exam ID' });
    const mock = await Mock.create(req.body);
    res.status(201).json(mock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a mock by ID
exports.updateMock = async (req, res) => {
  try {
    if (req.body.exam) {
      const exam = await Exam.findById(req.body.exam);
      if (!exam) return res.status(400).json({ message: 'Invalid exam ID' });
    }
    const mock = await Mock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mock) return res.status(404).json({ message: 'Mock not found' });
    res.json(mock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a mock by ID
exports.deleteMock = async (req, res) => {
  try {
    const mock = await Mock.findByIdAndDelete(req.params.id);
    if (!mock) return res.status(404).json({ message: 'Mock not found' });
    res.json({ message: 'Mock deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Assign questions to a mock (replace all questions)
exports.assignQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body; // array of Question IDs
    const mock = await Mock.findByIdAndUpdate(
      req.params.id,
      { questions: questionIds },
      { new: true }
    ).populate('questions').populate('exam');
    if (!mock) return res.status(404).json({ message: 'Mock not found' });
    res.json(mock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get analytics for a mock (stub, to be expanded)
exports.getMockAnalytics = async (req, res) => {
  try {
    // Example: number of users attempted, average score, completion rate
    // You need to implement logic based on your submission/attempt model
    res.json({
      attempts: 0,
      averageScore: 0,
      completionRate: 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk upload mocks via CSV
exports.uploadMocksCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const results = [];
  const filePath = req.file.path;
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          let examId = row.exam;
          // If exam is not an ObjectId, try to find by code or name
          if (!examId.match(/^[0-9a-fA-F]{24}$/)) {
            const exam = await Exam.findOne({ $or: [ { code: row.exam }, { name: row.exam } ] });
            examId = exam ? exam._id : undefined;
          }
          const mockObj = {
            name: row.name,
            exam: examId,
            day: row.day ? Number(row.day) : undefined,
            description: row.description,
            status: row.status || 'active',
            questions: row.questions ? row.questions.split(',').map(q => q.trim()) : []
          };
          results.push(mockObj);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    const inserted = await Mock.insertMany(results);
    fs.unlinkSync(filePath);
    res.json({ success: true, count: inserted.length });
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: err.message });
  }
};

// Download all mocks as CSV
exports.downloadMocksCSV = async (req, res) => {
  try {
    const mocks = await Mock.find().populate('questions').populate('exam');
    const fields = ['_id', 'name', 'exam', 'day', 'description', 'status', 'questions'];
    const parser = new Parser({ fields });
    const csvData = parser.parse(mocks.map(m => ({
      ...m.toObject(),
      exam: m.exam && m.exam.code ? m.exam.code : m.exam ? m.exam._id : '',
      questions: m.questions.map(q => q._id).join(',')
    })));
    res.header('Content-Type', 'text/csv');
    res.attachment('mocks.csv');
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
