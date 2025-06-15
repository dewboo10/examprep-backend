const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const Exam = require('../models/Exam');

const exams = [
  {
    name: "Common Admission Test",
    code: "CAT",
    description: "MBA entrance by IIMs",
    quizCount: 1000,
    icon: "fas fa-chart-line",
    colorTheme: "indigo",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "LRDI", timeLimit: 30 }
    ]
  },
  {
    name: "Symbiosis National Aptitude Test",
    code: "SNAP",
    description: "MBA entrance by Symbiosis",
    quizCount: 500,
    icon: "fas fa-building",
    colorTheme: "purple",
    sections: [
      { name: "Quant", timeLimit: 40 },
      { name: "VARC", timeLimit: 30 },
      { name: "GA", timeLimit: 20 }
    ]
  },
  // ... Add rest with similar sections format
];

const seedExams = async () => {
  try {
    console.log('🔁 Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    await Exam.deleteMany();
    await Exam.insertMany(exams);

    console.log(`✅ Seeded ${exams.length} exams`);
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

// seedExams();
