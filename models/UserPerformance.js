const mongoose = require('mongoose');

const userPerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  
  // Overall Performance Metrics
  totalQuestionsAttempted: {
    type: Number,
    default: 0
  },
  totalQuestionsCorrect: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  
  // Section-wise Performance
  sectionPerformance: {
    type: Map,
    of: {
      questionsAttempted: { type: Number, default: 0 },
      questionsCorrect: { type: Number, default: 0 },
      totalTimeSpent: { type: Number, default: 0 },
      averageTimePerQuestion: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    },
    default: {}
  },
  
  // Topic-wise Performance
  topicPerformance: {
    type: Map,
    of: {
      questionsAttempted: { type: Number, default: 0 },
      questionsCorrect: { type: Number, default: 0 },
      totalTimeSpent: { type: Number, default: 0 },
      averageTimePerQuestion: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      strength: { type: String, enum: ['weak', 'average', 'strong'], default: 'weak' }
    },
    default: {}
  },
  
  // Day-wise Progress
  dailyProgress: [{
    date: { type: Date, required: true },
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    streak: { type: Number, default: 0 }
  }],
  
  // Mock Test Performance
  mockTestPerformance: [{
    mockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mock' },
    day: { type: Number },
    totalScore: { type: Number },
    totalQuestions: { type: Number },
    timeSpent: { type: Number },
    accuracy: { type: Number },
    submittedAt: { type: Date },
    sections: [{
      name: { type: String },
      score: { type: Number },
      questionsAttempted: { type: Number },
      questionsCorrect: { type: Number }
    }]
  }],
  
  // Learning Analytics
  learningAnalytics: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    averageTimePerQuestion: { type: Number, default: 0 },
    weakestTopics: [{ type: String }],
    strongestTopics: [{ type: String }],
    improvementRate: { type: Number, default: 0 }, // percentage improvement over time
    lastActiveDate: { type: Date, default: Date.now }
  },
  
  // Study Patterns
  studyPatterns: {
    preferredTimeSlots: [{
      hour: { type: Number }, // 0-23
      frequency: { type: Number, default: 0 }
    }],
    averageSessionDuration: { type: Number, default: 0 }, // in minutes
    totalSessions: { type: Number, default: 0 },
    lastSessionDate: { type: Date }
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
userPerformanceSchema.index({ userId: 1, exam: 1 });
userPerformanceSchema.index({ 'learningAnalytics.lastActiveDate': -1 });

// Virtual for overall accuracy
userPerformanceSchema.virtual('overallAccuracy').get(function() {
  if (this.totalQuestionsAttempted === 0) return 0;
  return (this.totalQuestionsCorrect / this.totalQuestionsAttempted) * 100;
});

// Method to update performance after a question attempt
userPerformanceSchema.methods.updateQuestionAttempt = function(questionData) {
  const { 
    isCorrect, 
    timeSpent, 
    section, 
    topics, 
    questionId 
  } = questionData;
  
  // Update overall metrics
  this.totalQuestionsAttempted += 1;
  if (isCorrect) this.totalQuestionsCorrect += 1;
  this.totalTimeSpent += timeSpent;
  
  // Update section performance
  if (section) {
    if (!this.sectionPerformance.has(section)) {
      this.sectionPerformance.set(section, {
        questionsAttempted: 0,
        questionsCorrect: 0,
        totalTimeSpent: 0,
        averageTimePerQuestion: 0,
        accuracy: 0
      });
    }
    
    const sectionData = this.sectionPerformance.get(section);
    sectionData.questionsAttempted += 1;
    if (isCorrect) sectionData.questionsCorrect += 1;
    sectionData.totalTimeSpent += timeSpent;
    sectionData.averageTimePerQuestion = sectionData.totalTimeSpent / sectionData.questionsAttempted;
    sectionData.accuracy = (sectionData.questionsCorrect / sectionData.questionsAttempted) * 100;
  }
  
  // Update topic performance
  if (topics && topics.length > 0) {
    topics.forEach(topic => {
      if (!this.topicPerformance.has(topic)) {
        this.topicPerformance.set(topic, {
          questionsAttempted: 0,
          questionsCorrect: 0,
          totalTimeSpent: 0,
          averageTimePerQuestion: 0,
          accuracy: 0,
          strength: 'weak'
        });
      }
      
      const topicData = this.topicPerformance.get(topic);
      topicData.questionsAttempted += 1;
      if (isCorrect) topicData.questionsCorrect += 1;
      topicData.totalTimeSpent += timeSpent;
      topicData.averageTimePerQuestion = topicData.totalTimeSpent / topicData.questionsAttempted;
      topicData.accuracy = (topicData.questionsCorrect / topicData.questionsAttempted) * 100;
      
      // Update strength based on accuracy
      if (topicData.accuracy >= 80) topicData.strength = 'strong';
      else if (topicData.accuracy >= 60) topicData.strength = 'average';
      else topicData.strength = 'weak';
    });
  }
  
  // Update learning analytics
  this.learningAnalytics.averageAccuracy = this.overallAccuracy;
  this.learningAnalytics.averageTimePerQuestion = this.totalTimeSpent / this.totalQuestionsAttempted;
  this.learningAnalytics.lastActiveDate = new Date();
  
  return this.save();
};

// Method to update daily progress
userPerformanceSchema.methods.updateDailyProgress = function(questionsAttempted, questionsCorrect, timeSpent) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let todayProgress = this.dailyProgress.find(progress => 
    progress.date.getTime() === today.getTime()
  );
  
  if (!todayProgress) {
    todayProgress = {
      date: today,
      questionsAttempted: 0,
      questionsCorrect: 0,
      timeSpent: 0,
      accuracy: 0,
      streak: 0
    };
    this.dailyProgress.push(todayProgress);
  }
  
  todayProgress.questionsAttempted += questionsAttempted;
  todayProgress.questionsCorrect += questionsCorrect;
  todayProgress.timeSpent += timeSpent;
  todayProgress.accuracy = (todayProgress.questionsCorrect / todayProgress.questionsAttempted) * 100;
  
  // Update streak
  this.updateStreak();
  
  return this.save();
};

// Method to update streak
userPerformanceSchema.methods.updateStreak = function() {
  const sortedProgress = this.dailyProgress
    .sort((a, b) => b.date - a.date);
  
  let currentStreak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedProgress.length; i++) {
    const progress = sortedProgress[i];
    const daysDiff = Math.floor((currentDate - progress.date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak && progress.questionsAttempted > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  this.learningAnalytics.currentStreak = currentStreak;
  if (currentStreak > this.learningAnalytics.longestStreak) {
    this.learningAnalytics.longestStreak = currentStreak;
  }
};

const UserPerformance = mongoose.models.UserPerformance || mongoose.model('UserPerformance', userPerformanceSchema);

module.exports = UserPerformance; 