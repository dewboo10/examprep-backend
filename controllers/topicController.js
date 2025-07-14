const TopicSection = require('../models/TopicSection');
const Question = require('../models/Question');

// GET /api/admin/topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await TopicSection.find({}, 'topic sections');
    // For each topic, count the number of questions
    const topicsWithCounts = await Promise.all(
      topics.map(async (t) => {
        const count = await Question.countDocuments({ topics: t.topic });
        return {
          topic: t.topic,
          sections: t.sections,
          questionCount: count
        };
      })
    );
    res.json({ success: true, topics: topicsWithCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/topics
exports.createTopic = async (req, res) => {
  try {
    const { topic, sections } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'Topic is required' });
    const exists = await TopicSection.findOne({ topic });
    if (exists) return res.status(400).json({ success: false, message: 'Topic already exists' });
    const newTopic = await TopicSection.create({ topic, sections: sections || [] });
    res.json({ success: true, topic: newTopic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/topics/:topic
exports.updateTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const { sections } = req.body;
    const updated = await TopicSection.findOneAndUpdate(
      { topic },
      { $set: { sections, updatedAt: new Date() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, topic: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/topics/:topic
exports.deleteTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const deleted = await TopicSection.findOneAndDelete({ topic });
    if (!deleted) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 