// scripts/deleteAverageQuestions.js

const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

async function deleteAverageQuestions() {
  await mongoose.connect(process.env.MONGO_URI); // Make sure your .env has MONGO_URI

  const result = await Question.deleteMany({ topics: "Average" });
  console.log(`Deleted ${result.deletedCount} questions with topic "Average"`);

  await mongoose.disconnect();
}

deleteAverageQuestions();