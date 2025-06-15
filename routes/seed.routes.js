// ✅ routes/seed.routes.js
const express = require('express');
const router = express.Router();

const Exam = require('../models/Exam');
const Question = require('../models/Question');
const examData = require('../data/examsdata');

// 🧠 Optional: Load dynamic questions per exam/day
const fs = require('fs');
const path = require('path');

// ✅ Route: Seed All (exams + questions)
router.get('/seed-all', async (req, res) => {
  try {
    console.log('🔁 Clearing existing Exams and Questions...');
    await Exam.deleteMany();
    await Question.deleteMany();

    console.log('✅ Seeding Exams...');
    await Exam.insertMany(examData);

    console.log('✅ Seeding Questions...');
    const questionDir = path.join(__dirname, '../data/questions/cat');
    const files = fs.readdirSync(questionDir);

    let allQuestions = [];

    for (const file of files) {
      if (file.endsWith('.js')) {
        const questionData = require(path.join(questionDir, file));
        allQuestions.push(...questionData);
      }
    }

    await Question.insertMany(allQuestions);

    res.json({ message: `✅ Seeded ${examData.length} exams and ${allQuestions.length} questions.` });
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    res.status(500).json({ error: 'Seeding failed', details: err.message });
  }
});

module.exports = router;
