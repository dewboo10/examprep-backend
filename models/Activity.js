const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'question_created',
      'question_updated',
      'question_deleted',
      'mock_created',
      'mock_updated',
      'mock_deleted',
      'user_updated',
      'user_deleted',
      'csv_uploaded',
      'settings_changed'
    ]
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
module.exports = Activity; 