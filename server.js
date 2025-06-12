// ===== FILE: server.js - Corrected and Cleaned Version =====

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');





// Load env variables
dotenv.config();

// App setup
const app = express();
connectDB();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log('\n📝 New Request:');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

console.log('\n🔄 Loading routes...');

app.use((req, res, next) => {
  console.log('🔍 Incoming headers:', req.headers);
  next();
});

// Load route modules
const mockRoutes = require('./routes/mockRoutes');
const authRoutes = require('./routes/authRoutes'); 
const examRoutes = require('./routes/examRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
// Mount routes
app.use('/api/auth', authRoutes);                // Route: /api/auth/*
app.use('/api/exams', examRoutes);              // Route: /api/exams/*
app.use('/api/dashboard', dashboardRoutes);     // Route: /api/dashboard/*
app.use('/api/mock', mockRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

console.log('✅ Routes loaded');



app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // this comes from the auth middleware
    const user = await User.findById(userId).select('name avatar');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ name: user.name, avatar: user.avatar });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error fetching user info' });
  }
});


// Test route
app.post('/api/test', (req, res) => {
  console.log('✅ Test route hit');
  res.json({ message: "Direct route works" });
});

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  console.log('\n❌ Route not found:', req.url);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The route ${req.url} does not exist`
  });
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
console.log('\n✅ Server running on port', PORT);
console.log('\nAvailable routes:');
console.log('- POST /api/auth/register');
console.log('- POST /api/auth/login');
console.log('- POST /api/mock/submit');
console.log('- GET  /api/mock');

});
