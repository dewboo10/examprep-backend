const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Model
const Exam = require('../models/Exam');

const exams = [
  {
    name: "Common Admission Test",
    code: "CAT",
    description: "MBA entrance by IIMs",
    quizCount: 1000,
    icon: "fas fa-chart-line",
    colorTheme: "indigo"
  },
  {
    name: "Symbiosis National Aptitude Test",
    code: "SNAP",
    description: "MBA entrance by Symbiosis",
    quizCount: 500,
    icon: "fas fa-building",
    colorTheme: "purple"
  }
  ,
  {
    name: "Common Management Admission Test",
    code: "CMAT",
    description: "Entrance exam for MBA in India",
    quizCount: 500,
    icon: "fas fa-graduation-cap",
    colorTheme: "green"
  }
  ,
  {
    name: "NMIMSS Management Aptitute Test",
    code: "NMAT",
    description: "MBA entrance by Symbiosis",
    quizCount: 500,
    icon: "fas fa-university",
    colorTheme: "red"
  }
  ,
  {
    name: "Bank Probationary Test",
    code: "Bank PO",
    description: "Entry level exam for banks",
    quizCount: 1000,
    icon: "fas fa-building",
    colorTheme: "yellow"
  }
  ,
  {
    name: "Institute of Banking Personnel Selection Clerk",
    code: "IBPS Clerk",
    description: "MBA entrance by Symbiosis",
    quizCount: 1000,
    icon: "fas fa-check-circle",
    colorTheme: "blue"
  }
  ,
  {
    name: "School-Boards Level test",
    code: "CBSE, ICSE, State Board",
    description: "School level exams and tests",
    quizCount: 1000,
    icon: "fas fa-school",
    colorTheme: "pink"
  }
  ,
  {
    name: "Staff Selection Commission Exams",
    code: "SSC CGL",
    description: "Government job entrance exam",
    quizCount: 1000,
    icon: "fas fa-briefcase",
    colorTheme: "yellow"
  }
];

const seedExams = async () => {
  try {
    console.log('🔁 Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    await Exam.deleteMany();
    await Exam.insertMany(exams);

    console.log('✅ Exams seeded!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedExams();
