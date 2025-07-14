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
  topics: [{ type: String, required: true }],
  type: {
    type: String,
    enum: ['mock', 'practice'],
    default: 'mock'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: undefined
  },
  
  // Analytics Fields
  analytics: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 }, // in seconds
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    successRate: { type: Number, default: 0 }, // percentage
    skipRate: { type: Number, default: 0 }, // percentage
    flagRate: { type: Number, default: 0 } // percentage
  },
  
  // Question Metadata
  metadata: {
    estimatedTime: { type: Number, default: 60 }, // estimated time in seconds
    complexity: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    cognitiveLevel: {
      type: String,
      enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
      default: 'apply'
    },
    tags: [{ type: String }],
    source: { type: String, default: 'custom' },
    lastUpdated: { type: Date, default: Date.now },
    level: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'other'],
      required: true
    }
  }
});

// Indexes for better query performance
questionSchema.index({ exam: 1, section: 1 });
questionSchema.index({ topics: 1 });
questionSchema.index({ 'analytics.difficulty': 1 });
questionSchema.index({ 'metadata.complexity': 1 });

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  if (this.analytics.totalAttempts === 0) return 0;
  return (this.analytics.correctAttempts / this.analytics.totalAttempts) * 100;
});

// Method to update analytics after an attempt
questionSchema.methods.updateAnalytics = function(attemptData) {
  const { isCorrect, timeSpent, wasSkipped, wasFlagged } = attemptData;
  
  this.analytics.totalAttempts += 1;
  if (isCorrect) this.analytics.correctAttempts += 1;
  
  // Update average time spent
  const totalTime = this.analytics.averageTimeSpent * (this.analytics.totalAttempts - 1) + timeSpent;
  this.analytics.averageTimeSpent = totalTime / this.analytics.totalAttempts;
  
  // Update success rate
  this.analytics.successRate = this.successRate;
  
  // Update skip and flag rates
  if (wasSkipped) {
    this.analytics.skipRate = ((this.analytics.skipRate * (this.analytics.totalAttempts - 1)) + 1) / this.analytics.totalAttempts * 100;
  }
  
  if (wasFlagged) {
    this.analytics.flagRate = ((this.analytics.flagRate * (this.analytics.totalAttempts - 1)) + 1) / this.analytics.totalAttempts * 100;
  }
  
  // Update difficulty based on success rate
  if (this.analytics.successRate >= 80) this.analytics.difficulty = 'easy';
  else if (this.analytics.successRate <= 40) this.analytics.difficulty = 'hard';
  else this.analytics.difficulty = 'medium';
  
  return this.save();
};

// Static method to get questions by difficulty
questionSchema.statics.getByDifficulty = function(exam, difficulty) {
  return this.find({ exam, 'analytics.difficulty': difficulty });
};

// Static method to get questions by topic
questionSchema.statics.getByTopic = function(exam, topic) {
  return this.find({ exam, topics: topic });
};

// Static method to get questions by complexity
questionSchema.statics.getByComplexity = function(exam, complexity) {
  return this.find({ exam, 'metadata.complexity': complexity });
};

// Static method to get analytics summary
questionSchema.statics.getAnalyticsSummary = function(exam) {
  return this.aggregate([
    { $match: { exam } },
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        averageSuccessRate: { $avg: '$analytics.successRate' },
        averageTimeSpent: { $avg: '$analytics.averageTimeSpent' },
        easyQuestions: { $sum: { $cond: [{ $eq: ['$analytics.difficulty', 'easy'] }, 1, 0] } },
        mediumQuestions: { $sum: { $cond: [{ $eq: ['$analytics.difficulty', 'medium'] }, 1, 0] } },
        hardQuestions: { $sum: { $cond: [{ $eq: ['$analytics.difficulty', 'hard'] }, 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Question', questionSchema);
