// scripts/seedQuestions.js - Seed full CAT Day 1 questions
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");

dotenv.config({ path: "../.env" });

const questions = [];

// Real YouTube Video Links for testing
const demoVideo1 = "https://www.youtube.com/watch?v=5MgBikgcWnY"; // TED-Ed
const demoVideo2 = "https://www.youtube.com/watch?v=fC9da6eqaqg"; // Khan Academy
const demoVideo3 = "https://www.youtube.com/watch?v=QIPNSxE-DgE"; // VARC strategy

// Generate 8 Quant Questions
for (let i = 1; i <= 8; i++) {
  questions.push({
    exam: "CAT",
    day: 1,
    section: "Quant",
    id: i,
    passage: [
  "India is a vast country with diverse cultures.",
  "It has 28 states and 8 union territories."
],
    question: `Quant Question ${i}: What is ${i} + ${i}?`,
    options: [
      `${i + i - 1}`,
      `${i + i}`,
      `${i * i}`,
      `${i + 2}`
    ],
    answerIndex: 1,
    explanation: `${i} + ${i} = ${i + i}`,
    videoUrl: demoVideo2,
    videoStart: 10 + i
  });
}

// Generate 8 VARC Questions
for (let i = 1; i <= 8; i++) {
  questions.push({
    exam: "CAT",
    day: 1,
    section: "VARC",
    id: i + 8,
    passage: [
  "India is a vast country with diverse cultures.",
  "It has 28 states and 8 union territories."
],
    question: `VARC Question ${i}: Choose the synonym for 'Quick'`,
    options: ["Slow", "Rapid", "Calm", "Weak"],
    answerIndex: 1,
    explanation: "'Rapid' is a synonym for 'Quick'",
    videoUrl: demoVideo3,
    videoStart: 20
  });
}

// Generate 4 LRDI Questions
for (let i = 1; i <= 4; i++) {
  questions.push({
    exam: "CAT",
    day: 1,
    section: "LRDI",
    id: i + 16,
   passage: [
  "India is a vast country with diverse cultures.",
  "It has 28 states and 8 union territories."
  ],
    question: `LRDI Question ${i}: A is left of B, B is left of C. Who is in middle?`,
    options: ["A", "B", "C", "Cannot determine"],
    answerIndex: 1,
    explanation: "A < B < C, so B is in the middle",
    videoUrl: demoVideo1,
    videoStart: 30
  });
}

questions.push({
  exam: "SNAP",
  day: 1,
  section: "Quant",
  id: 1,
  passage: [
    "India is a vast country with diverse cultures.",
    "It has 28 states and 8 union territories."
  ],
  question: "GA Question: What is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  answerIndex: 1,
  explanation: "The capital of India is Delhi.",
  videoUrl: demoVideo1,
  videoStart: 40
});

questions.push({
  exam: "SNAP",
  day: 1,
  section: "VARC",
  id: 4,
  passage: [
    "India is a vast country with diverse cultures.",
    "It has 28 states and 8 union territories."
  ],
  question: "GA Question: What is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  answerIndex: 1,
  explanation: "The capital of India is Delhi.",
  videoUrl: demoVideo1,
  videoStart: 40
});

questions.push({
  exam: "SNAP",
  day: 1,
  section: "LRDI",
  id: 1,
  passage: [
    "India is a vast country with diverse cultures.",
    "It has 28 states and 8 union territories."
  ],
  question: "GA Question: What is the capital of India?",
  options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
  answerIndex: 1,
  explanation: "The capital of India is Delhi.",
  videoUrl: demoVideo1,
  videoStart: 40
});





async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Question.deleteMany({}); // Clear all to prevent garbage buildup

;
    await Question.insertMany(questions);

    console.log("✅ Seeded 20 CAT Day 1 questions");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
