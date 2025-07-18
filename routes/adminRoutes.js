const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');
const { getAllUsers, deleteUser, updateUser, patchUser } = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dashboardController = require('../controllers/dashboardController');
const mockController = require('../controllers/mockController');
const Mock = require('../models/Mock');
const Question = require('../models/Question');
const topicController = require('../controllers/topicController');

// Add CORS to all admin routes
router.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://parikshaprep.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Test admin-only route
router.get('/test-admin', auth, authorizeAdmin, (req, res) => {
  res.json({ message: 'Hello Admin! You have access.' });
});

// Admin Questions CRUD
router.get('/questions', auth, authorizeAdmin, questionController.getAllQuestions); // List
router.post('/questions', auth, authorizeAdmin, questionController.createQuestion); // Create
router.put('/questions/:id', auth, authorizeAdmin, questionController.updateQuestion); // Update
router.delete('/questions/:id', auth, authorizeAdmin, questionController.deleteQuestion); // Delete
router.post('/questions/upload-csv', auth, authorizeAdmin, upload.single('file'), require('../controllers/questionController').uploadQuestionsCSV);
// router.delete('/questions/topic/:topic', auth, authorizeAdmin, questionController.deleteQuestionsByTopic); // (TEMPORARY/REMOVED)
router.get('/stats', auth, authorizeAdmin, dashboardController.adminStats);

// Add upload progress endpoint for polling
router.get('/questions/upload-progress/:uploadId', auth, authorizeAdmin, questionController.getUploadProgress);

// Admin Mocks CRUD
router.get('/mocks', auth, authorizeAdmin, mockController.getMocks); // List
router.post('/mocks', auth, authorizeAdmin, mockController.createMock); // Create
router.put('/mocks/:id', auth, authorizeAdmin, mockController.updateMock); // Update
router.delete('/mocks/:id', auth, authorizeAdmin, mockController.deleteMock); // Delete

// Assign questions to a mock
router.post('/mocks/:id/questions', auth, authorizeAdmin, mockController.assignQuestions);

// Mock analytics
router.get('/mocks/:id/analytics', auth, authorizeAdmin, mockController.getMockAnalytics);

// Bulk upload/download mocks as CSV
router.post('/mocks/upload-csv', auth, authorizeAdmin, upload.single('file'), mockController.uploadMocksCSV);
router.get('/mocks/download-csv', auth, authorizeAdmin, mockController.downloadMocksCSV);

// Get all questions for a mock's exam and assigned questions
router.get('/mocks/:mockId/questions', auth, authorizeAdmin, async (req, res) => {
  try {
    const mock = await Mock.findById(req.params.mockId).populate('questions');
    if (!mock) return res.status(404).json({ success: false, message: 'Mock not found' });

    // Fetch all questions for the same exam as the mock
    const allQuestions = await Question.find({ exam: mock.exam });
    res.json({
      allQuestions,
      assignedQuestions: mock.questions.map(q => q._id.toString())
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin: List all users
router.get('/users', auth, authorizeAdmin, getAllUsers);
// Admin: Delete a user
router.delete('/users/:id', auth, authorizeAdmin, deleteUser);
// Admin: Update a user
router.put('/users/:id', auth, authorizeAdmin, updateUser);
// Admin: Partially update a user
router.patch('/users/:id', auth, authorizeAdmin, patchUser);

// Admin Topics CRUD
router.get('/topics', topicController.getAllTopics);
router.post('/topics', topicController.createTopic);
router.put('/topics/:topic', topicController.updateTopic);
router.delete('/topics/:topic', topicController.deleteTopic);

// Admin: Download CSV upload instructions README
const path = require('path');
router.get('/download-csv-readme', auth, authorizeAdmin, (req, res) => {
  const filePath = path.resolve(__dirname, '../admin/README-CSV-UPLOAD.md');
  res.download(filePath, 'CSV-Upload-Instructions.md');
});

module.exports = router; 