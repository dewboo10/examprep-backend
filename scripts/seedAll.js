const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load models
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Load data
const exams = require('../data/examData'); // Centralized exam list

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const EXAMS = [
  { name: 'cat', days: 50 },
  { name: 'snap', days: 4 },
  { name: 'nmat', days: 4 },
  { name: 'xat', days: 4 },
];

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

    // Insert questions for all exams and days
    let totalQuestions = 0;
    for (const { name, days } of EXAMS) {
      for (let day = 1; day <= days; day++) {
        const filePath = path.resolve(__dirname, `../data/questions/${name}/day${day}.js`);
        if (fs.existsSync(filePath)) {
          const questions = require(filePath);
          if (Array.isArray(questions) && questions.length > 0) {
            await Question.insertMany(questions);
            totalQuestions += questions.length;
            console.log(`✅ Inserted ${questions.length} questions for ${name.toUpperCase()} Day ${day}`);
          } else {
            console.log(`⚠️  No questions found in ${name}/day${day}.js`);
          }
        } else {
          console.log(`⚠️  File not found: ${name}/day${day}.js`);
        }
      }
    }
    console.log(`🎉 Total questions inserted: ${totalQuestions}`);
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
