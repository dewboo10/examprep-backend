const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exam:        { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  day:         { type: Number, required: function() { return this.type === 'mock'; } },
  section:     { type: String, required: function() { return this.type === 'mock'; } },
  id:          { type: String, required: true },
  img:         { type: String, default: null },
  passage:     { type: String, default: null},
  question:    { type: String, required: true },
  options:     [{ type: String, required: true }],
  answerIndex: { type: Number, required: true },
  explanation: String,
  video:       String,
  videoUrl:    String,  
  videoStart:  Number,
  topics: [{ type: String }],
  type: {
    type: String,
    enum: ['mock', 'practice'],
    default: 'mock'
  }
});

module.exports = mongoose.model('Question', questionSchema);
