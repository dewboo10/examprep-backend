const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: String,
  score: Number,
  answers: [Number]
});

const MockSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam: String,
  day: Number,
  answers: Object,
  reviewFlags: Object,
  timeSpent: Number,
  totalQuestions: Number,
  totalScore: Number,
  sections: [sectionSchema],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockSubmission', MockSubmissionSchema);
