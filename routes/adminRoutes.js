const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dashboardController = require('../controllers/dashboardController');
const mockController = require('../controllers/mockController');

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

module.exports = router; 