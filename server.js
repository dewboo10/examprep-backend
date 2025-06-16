const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');

dotenv.config();
const app = express();

// ✅ CORS setup (Netlify + localhost)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://tubular-entremet-8f2a2a.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Parse JSON payloads
app.use(express.json());

// 📝 Debug logs
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

// ✅ Optional: respond to health check
app.get('/', (req, res) => {
  res.send('🎉 Exam Prep backend is live and healthy!');
});

// ✅ Route imports
const mockRoutes = require('./routes/mockRoutes');
const authRoutes = require('./routes/authRoutes'); 
const examRoutes = require('./routes/examRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const questionRoutes = require('./routes/questionRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const seedRoutes = require('./routes/seed.routes');
// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/seed', seedRoutes);


// ✅ Health check route
app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});



// ✅ Secure user info
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ name: user.name, avatar: user.avatar });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error fetching user info' });
  }
});

// ✅ Test route
app.post('/api/test', (req, res) => {
  res.json({ message: "✅ Test route works" });
});

// ✅ Serve static files (if needed)
app.use(express.static(path.join(__dirname, '../client')));

// ❌ Route not found handler (404)
app.use((req, res) => {
  console.log('\n❌ Route not found:', req.url);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The route ${req.url} does not exist`
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('\n❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log('\n✅ Server running on port', PORT);
  console.log('\nAvailable routes:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/mock/submit');
  console.log('- GET  /api/mock');
});
