const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Exam = require('../models/Exam');

// ✅ Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ Define seed data
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
  // 🔁 Add more exams below if needed
];

// ✅ Main seeding function
const seedExams = async () => {
  try {
    console.log('🔁 Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    const existing = await Exam.find({});
    if (existing.length > 0) {
      console.log('ℹ️ Exams already exist in DB. Skipping seeding.');
    } else {
      await Exam.insertMany(exams);
      console.log(`✅ Successfully seeded ${exams.length} exams.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

// ✅ Safe execution guard — only runs when manually executed
if (require.main === module) {
  seedExams();
}
