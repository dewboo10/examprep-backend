const mongoose = require('mongoose');

const topicSectionSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  sections: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

topicSectionSchema.index({ topic: 1 });

const TopicSection = mongoose.models.TopicSection || mongoose.model('TopicSection', topicSectionSchema);

module.exports = TopicSection; 