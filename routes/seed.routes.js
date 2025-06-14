// In routes/examRoutes.js or a new file routes/seedRoutes.js
const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Question = require('../models/Question'); // If this exists
const exams = require('../scripts/seedExams'); // You can move array here if needed
const questions = require('../scripts/seedQuestions'); // For example

router.get('/seed-all', async (req, res) => {
  try {
    await Exam.deleteMany();
    await Exam.insertMany(exams);
    
    await Question.deleteMany();
    await Question.insertMany(questions);

    res.json({ message: '✅ Seeded exams and questions!' });
  } catch (error) {
    console.error('Seeding failed:', error);
    res.status(500).json({ error: 'Seeding failed', details: error.message });
  }
});

module.exports = router;
