const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  exam:        { type: String, required: true },
  day:         { type: Number, required: true },
  section:     { type: String, required: true },
  id:          { type: String, required: true },
  img:         { type: String, default: null },
  passage:     { type: String, default: null},
  question:    { type: String, required: true },
  options:     [{ type: String, required: true }],f
  answerIndex: { type: Number, required: true },
  explanation: String,
  video:       String,
  videoUrl:    String,  
  videoStart:  Number
});

module.exports = mongoose.model('Question', questionSchema);
