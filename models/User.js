const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  selectedExam: {
    type: String,
    default: ''
  },
  streak: {
    type: Number,
    default: 0
  },
  stats: {
    quizzesTaken: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    hoursSpent: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Add this check to prevent model overwrite
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;