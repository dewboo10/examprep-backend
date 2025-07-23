git // Usage: node scripts/deleteQuestionsByTopic.js "LinearEquation"
require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error('Please provide a topic as an argument.');
    process.exit(1);
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log(`Connected to MongoDB. Deleting questions with topic: ${topic}`);
  try {
    const result = await Question.deleteMany({ topics: topic });
    console.log(`Deleted ${result.deletedCount} questions with topic: ${topic}`);
    process.exit(0);
  } catch (err) {
    console.error('Error deleting questions:', err);
    process.exit(1);
  }
}

main(); 