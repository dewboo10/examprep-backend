const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Load data
const exams = require('../data/examData'); // ✅ Centralized exam list
const day1CatQuestions = require('../data/questions/cat/day1'); // ✅ Day 1 questions

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // Clear old data
    await Exam.deleteMany();
    await Question.deleteMany();

    // Insert exam list from examData.js
    await Exam.insertMany(exams);
    console.log(`✅ Inserted ${exams.length} exams`);

    // Insert questions (e.g. CAT Day 1)
    await Question.insertMany(day1CatQuestions);
    console.log(`✅ Inserted ${day1CatQuestions.length} CAT Day 1 questions`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

// Run when script is called directly
if (require.main === module) {
  seedAll();
}
