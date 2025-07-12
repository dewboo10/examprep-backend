const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dashboardController = require('../controllers/dashboardController');
const mockController = require('../controllers/mockController');
const Mock = require('../models/Mock');
const Question = require('../models/Question');

// Add CORS to all admin routes
router.use(cors());

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
router.get('/stats', auth, authorizeAdmin, dashboardController.adminStats);

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

module.exports = router; 