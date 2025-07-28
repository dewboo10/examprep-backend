const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/User');
const Exam = require('./models/Exam');
const Mock = require('./models/Mock');
const Question = require('./models/Question');
// Register new performance tracking models
const UserPerformance = require('./models/UserPerformance');
const QuestionAttempt = require('./models/QuestionAttempt');
const StudySession = require('./models/StudySession');
const adminActivityRouter = require('./routes/adminActivity');
const practiceRoutes = require('./routes/practiceRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();
const app = express();

// ✅ CORS setup (Netlify + localhost)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'https://parikshaprep.in',
    'https://localhost',
    'http://localhost',
    'capacitor://localhost'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

// ✅ Enhanced health check with uptime monitoring
let serverStartTime = Date.now();
let requestCount = 0;

app.get('/', (req, res) => {
  const uptime = Date.now() - serverStartTime;
  const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
  const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
  
  res.json({
    status: '🎉 Exam Prep backend is live and healthy!',
    uptime: `${uptimeHours}h ${uptimeMinutes}m`,
    totalRequests: requestCount,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
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
const customMockRoutes = require('./routes/customMockRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/mock/custom', customMockRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/comments', commentRoutes);

// ✅ Enhanced ping endpoint for keep-alive
app.get('/api/ping', (req, res) => {
  requestCount++;
  const uptime = Date.now() - serverStartTime;
  
  res.json({
    status: 'pong',
    uptime: `${Math.floor(uptime / 1000)}s`,
    requests: requestCount,
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ Keep-alive endpoint for external monitoring
app.get('/api/health', (req, res) => {
  requestCount++;
  
  // Check database connection
  const dbStatus = mongoose.connection.readyState === 1;
  
  if (!dbStatus) {
    return res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: Date.now() - serverStartTime,
    requests: requestCount,
    timestamp: new Date().toISOString()
  });
});

// ✅ Render-specific keep-alive mechanism
const renderKeepAlive = () => {
  // For Render, we need to ping the external URL, not localhost
  const renderUrl = process.env.RENDER_EXTERNAL_URL || process.env.RENDER_EXTERNAL_HOSTNAME;
  
  if (!renderUrl) {
    console.log('⚠️  RENDER_EXTERNAL_URL not set, skipping self-ping');
    return;
  }
  
  // Fix the URL construction to avoid double https://
  let url;
  if (renderUrl.startsWith('http://') || renderUrl.startsWith('https://')) {
    url = `${renderUrl}/api/ping`;
  } else {
    url = `https://${renderUrl}/api/ping`;
  }
  
  console.log(`🔄 Render self-ping: ${url}`);
  
  // Use fetch if available, otherwise use https module
  if (typeof fetch !== 'undefined') {
    fetch(url)
      .then(response => response.json())
      .then(data => console.log('✅ Render self-ping successful:', data.status))
      .catch(err => console.log('❌ Render self-ping failed:', err.message));
  } else {
    const https = require('https');
    const urlObj = new URL(url);
    
    const req = https.request({
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000
    }, (res) => {
      console.log('✅ Render self-ping successful, status:', res.statusCode);
    });
    
    req.on('error', (err) => {
      console.log('❌ Render self-ping failed:', err.message);
    });
    
    req.on('timeout', () => {
      console.log('⏰ Render self-ping timeout');
      req.destroy();
    });
    
    req.end();
  }
};

// ✅ Start Render keep-alive every 10 minutes (Render's timeout is ~15 minutes)
if (process.env.NODE_ENV === 'production' && process.env.RENDER) {
  setInterval(renderKeepAlive, 10 * 60 * 1000); // 10 minutes
  console.log('🔄 Render keep-alive mechanism activated (every 10 minutes)');
  
  // Initial ping after 30 seconds
  setTimeout(renderKeepAlive, 30 * 1000);
}

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
  console.log('🔄 Keep-alive system: ACTIVE');
  console.log('📊 Health check endpoints:');
  console.log('   - GET  / (basic health)');
  console.log('   - GET  /api/ping (detailed ping)');
  console.log('   - GET  /api/health (monitoring)');
  console.log('\nAvailable routes:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/mock/submit');
  console.log('- GET  /api/mock');
  console.log('- GET  /api/questions');
  console.log('- GET  /api/questions/topic/:topic');
  console.log('- POST /api/practice/attempt');
  // ... add more as needed
});
