const mongoose = require('mongoose');

const questionAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  
  // Attempt Details
  selectedAnswer: {
    type: Number, // index of selected option
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  
  // Context Information
  section: {
    type: String,
    required: true
  },
  topics: [{
    type: String
  }],
  day: {
    type: Number
  },
  
  // Session Information
  sessionId: {
    type: String, // to group attempts from same session
    required: true
  },
  attemptNumber: {
    type: Number, // 1st, 2nd, 3rd attempt on same question
    default: 1
  },
  
  // User Behavior
  wasFlagged: {
    type: Boolean,
    default: false
  },
  wasSkipped: {
    type: Boolean,
    default: false
  },
  confidenceLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Timing Details
  timeToFirstAnswer: {
    type: Number, // time to first selection
    default: 0
  },
  timeToFinalAnswer: {
    type: Number, // time to final selection
    default: 0
  },
  answerChanges: [{
    fromOption: { type: Number },
    toOption: { type: Number },
    timestamp: { type: Date }
  }],
  
  // Learning Analytics
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  userDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Metadata
  deviceInfo: {
    type: String,
    default: null
  },
  browserInfo: {
    type: String,
    default: null
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date,
    required: true
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
questionAttemptSchema.index({ userId: 1, questionId: 1 });
questionAttemptSchema.index({ userId: 1, exam: 1 });
questionAttemptSchema.index({ userId: 1, section: 1 });
questionAttemptSchema.index({ userId: 1, submittedAt: -1 });
questionAttemptSchema.index({ sessionId: 1 });

// Virtual for total time spent
questionAttemptSchema.virtual('totalTimeSpent').get(function() {
  return this.timeToFinalAnswer || this.timeSpent;
});

// Method to calculate user difficulty based on performance
questionAttemptSchema.methods.calculateUserDifficulty = function() {
  if (this.timeSpent < 30) return 'easy';
  if (this.timeSpent > 120) return 'hard';
  return 'medium';
};

// Method to update answer changes
questionAttemptSchema.methods.addAnswerChange = function(fromOption, toOption) {
  this.answerChanges.push({
    fromOption,
    toOption,
    timestamp: new Date()
  });
};

// Static method to get user's performance on a specific question
questionAttemptSchema.statics.getUserQuestionPerformance = function(userId, questionId) {
  return this.find({ userId, questionId })
    .sort({ submittedAt: -1 })
    .select('isCorrect timeSpent attemptNumber submittedAt');
};

// Static method to get user's performance by section
questionAttemptSchema.statics.getUserSectionPerformance = function(userId, exam, section) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), exam, section } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        correctAttempts: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        totalTimeSpent: { $sum: '$timeSpent' },
        averageTimeSpent: { $avg: '$timeSpent' }
      }
    }
  ]);
};

// Static method to get user's topic performance
questionAttemptSchema.statics.getUserTopicPerformance = function(userId, exam, topic) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), exam, topics: topic } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        correctAttempts: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        totalTimeSpent: { $sum: '$timeSpent' },
        averageTimeSpent: { $avg: '$timeSpent' }
      }
    }
  ]);
};

// Static method to get learning progress over time
questionAttemptSchema.statics.getLearningProgress = function(userId, exam, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        exam,
        submittedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' }
        },
        attempts: { $sum: 1 },
        correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        totalTime: { $sum: '$timeSpent' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const QuestionAttempt = mongoose.models.QuestionAttempt || mongoose.model('QuestionAttempt', questionAttemptSchema);

module.exports = QuestionAttempt; 