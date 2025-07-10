const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

module.exports = router; 