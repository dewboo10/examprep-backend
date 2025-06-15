const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  quizCount: { type: Number },
  icon: { type: String },
  colorTheme: { type: String },
  sections: [{
    name: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    marksPerQuestion: { type: Number, default: 1 },
    negativeMarking: { type: Number, default: 0.25 }
  }],
  price: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
