const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Session Details
  sessionType: {
    type: String,
    enum: ['practice', 'mock', 'review', 'custom'],
    required: true
  },
  title: {
    type: String,
    default: 'Study Session'
  },
  
  // Timing Information
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  
  // Session Configuration
  configuration: {
    totalQuestions: { type: Number, default: 0 },
    sections: [{ type: String }],
    topics: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed'
    },
    timeLimit: { type: Number, default: null }, // in seconds
    allowReview: { type: Boolean, default: true },
    showExplanation: { type: Boolean, default: true }
  },
  
  // Session Progress
  progress: {
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    questionsSkipped: { type: Number, default: 0 },
    questionsFlagged: { type: Number, default: 0 },
    currentQuestionIndex: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false }
  },
  
  // Performance Metrics
  performance: {
    accuracy: { type: Number, default: 0 },
    averageTimePerQuestion: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    timeEfficiency: { type: Number, default: 0 }, // questions per minute
    completionRate: { type: Number, default: 0 }
  },
  
  // Section-wise Performance
  sectionPerformance: [{
    section: { type: String },
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  }],
  
  // Topic-wise Performance
  topicPerformance: [{
    topic: { type: String },
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  }],
  
  // User Behavior
  behavior: {
    pauses: [{
      startTime: { type: Date },
      endTime: { type: Date },
      duration: { type: Number } // in seconds
    }],
    totalPauseTime: { type: Number, default: 0 },
    answerChanges: { type: Number, default: 0 },
    timeSpentOnReview: { type: Number, default: 0 },
    focusScore: { type: Number, default: 100 } // 0-100, decreases with pauses
  },
  
  // Session Metadata
  metadata: {
    deviceType: { type: String, default: 'desktop' },
    browser: { type: String, default: null },
    ipAddress: { type: String, default: null },
    location: { type: String, default: null },
    notes: { type: String, default: null }
  },
  
  // Questions in this session
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    order: { type: Number },
    timeSpent: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: false },
    wasSkipped: { type: Boolean, default: false },
    wasFlagged: { type: Boolean, default: false },
    selectedAnswer: { type: Number, default: null },
    answerChanges: { type: Number, default: 0 }
  }]
}, { 
  timestamps: true 
});

// Indexes for better query performance
studySessionSchema.index({ userId: 1, exam: 1 });
studySessionSchema.index({ userId: 1, startTime: -1 });
studySessionSchema.index({ sessionId: 1 });
studySessionSchema.index({ 'progress.isCompleted': 1 });

// Virtual for session status
studySessionSchema.virtual('status').get(function() {
  if (!this.endTime) return 'active';
  return this.progress.isCompleted ? 'completed' : 'abandoned';
});

// Method to start a session
studySessionSchema.methods.startSession = function() {
  this.startTime = new Date();
  this.sessionId = `session_${this.userId}_${Date.now()}`;
  return this.save();
};

// Method to end a session
studySessionSchema.methods.endSession = function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  
  // Calculate performance metrics
  this.calculatePerformance();
  
  return this.save();
};

// Method to add a question to the session
studySessionSchema.methods.addQuestion = function(questionId, order) {
  this.questions.push({
    questionId,
    order,
    timeSpent: 0,
    isCorrect: false,
    wasSkipped: false,
    wasFlagged: false,
    selectedAnswer: null,
    answerChanges: 0
  });
  
  this.configuration.totalQuestions = this.questions.length;
  return this.save();
};

// Method to update question attempt
studySessionSchema.methods.updateQuestionAttempt = function(questionIndex, attemptData) {
  const { 
    isCorrect, 
    timeSpent, 
    selectedAnswer, 
    wasSkipped, 
    wasFlagged, 
    answerChanges 
  } = attemptData;
  
  if (this.questions[questionIndex]) {
    this.questions[questionIndex].isCorrect = isCorrect;
    this.questions[questionIndex].timeSpent = timeSpent;
    this.questions[questionIndex].selectedAnswer = selectedAnswer;
    this.questions[questionIndex].wasSkipped = wasSkipped;
    this.questions[questionIndex].wasFlagged = wasFlagged;
    this.questions[questionIndex].answerChanges = answerChanges;
  }
  
  // Update progress
  this.progress.questionsAttempted += 1;
  if (isCorrect) this.progress.questionsCorrect += 1;
  if (wasSkipped) this.progress.questionsSkipped += 1;
  if (wasFlagged) this.progress.questionsFlagged += 1;
  
  this.progress.currentQuestionIndex = questionIndex + 1;
  
  // Check if session is completed
  if (this.progress.questionsAttempted >= this.configuration.totalQuestions) {
    this.progress.isCompleted = true;
  }
  
  return this.save();
};

// Method to calculate performance metrics
studySessionSchema.methods.calculatePerformance = function() {
  // Calculate accuracy
  this.performance.accuracy = this.progress.questionsAttempted > 0 
    ? (this.progress.questionsCorrect / this.progress.questionsAttempted) * 100 
    : 0;
  
  // Calculate total time spent
  this.performance.totalTimeSpent = this.questions.reduce((total, q) => total + q.timeSpent, 0);
  
  // Calculate average time per question
  this.performance.averageTimePerQuestion = this.progress.questionsAttempted > 0 
    ? this.performance.totalTimeSpent / this.progress.questionsAttempted 
    : 0;
  
  // Calculate time efficiency (questions per minute)
  this.performance.timeEfficiency = this.performance.totalTimeSpent > 0 
    ? (this.progress.questionsAttempted / (this.performance.totalTimeSpent / 60)) 
    : 0;
  
  // Calculate completion rate
  this.performance.completionRate = this.configuration.totalQuestions > 0 
    ? (this.progress.questionsAttempted / this.configuration.totalQuestions) * 100 
    : 0;
  
  // Calculate focus score
  const totalPauseTime = this.behavior.totalPauseTime;
  const activeTime = this.duration - totalPauseTime;
  this.behavior.focusScore = this.duration > 0 
    ? Math.max(0, Math.min(100, (activeTime / this.duration) * 100)) 
    : 100;
};

// Method to add pause
studySessionSchema.methods.addPause = function(startTime, endTime) {
  const pauseDuration = Math.floor((endTime - startTime) / 1000);
  this.behavior.pauses.push({
    startTime,
    endTime,
    duration: pauseDuration
  });
  this.behavior.totalPauseTime += pauseDuration;
  return this.save();
};

// Static method to get user's study sessions
studySessionSchema.statics.getUserSessions = function(userId, exam, limit = 10) {
  return this.find({ userId, exam })
    .sort({ startTime: -1 })
    .limit(limit)
    .populate('questions.questionId', 'question topics section');
};

// Static method to get session analytics
studySessionSchema.statics.getSessionAnalytics = function(userId, exam, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        exam,
        startTime: { $gte: startDate },
        'progress.isCompleted': true
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalTimeSpent: { $sum: '$duration' },
        averageSessionDuration: { $avg: '$duration' },
        averageAccuracy: { $avg: '$performance.accuracy' },
        averageFocusScore: { $avg: '$behavior.focusScore' },
        totalQuestionsAttempted: { $sum: '$progress.questionsAttempted' },
        totalQuestionsCorrect: { $sum: '$progress.questionsCorrect' }
      }
    }
  ]);
};

const StudySession = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema);

module.exports = StudySession; 