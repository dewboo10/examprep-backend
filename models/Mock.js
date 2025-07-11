const mongoose = require('mongoose');

const MockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  day: { type: Number },
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

module.exports = mongoose.model('Mock', MockSchema);
