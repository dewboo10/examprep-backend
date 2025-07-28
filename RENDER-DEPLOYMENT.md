# Render Deployment Guide for Exam Prep Backend

## 🚀 Quick Setup

### 1. Environment Variables (Required)
Set these in your Render dashboard:

```bash
NODE_ENV=production
RENDER=true
PORT=5050
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_from_email@domain.com
```

### 2. Render-Specific Variables (Auto-set by Render)
- `RENDER_EXTERNAL_URL` - Your app's external URL
- `RENDER_EXTERNAL_HOSTNAME` - Your app's hostname
- `RENDER_SERVICE_ID` - Your service ID

## 🔄 Keep-Alive Strategies

### Option 1: Built-in Self-Ping (Recommended)
The server automatically pings itself every 10 minutes when deployed on Render.

**Requirements:**
- `NODE_ENV=production`
- `RENDER=true`

### Option 2: External Monitoring Services

#### UptimeRobot (Free)
1. Go to [UptimeRobot](https://uptimerobot.com/)
2. Add new monitor
3. Set URL: `https://your-app-name.onrender.com/api/health`
4. Set check interval: 5 minutes

#### Pingdom (Free tier available)
1. Go to [Pingdom](https://pingdom.com/)
2. Add new uptime check
3. Set URL: `https://your-app-name.onrender.com/api/ping`
4. Set check interval: 5 minutes

#### Cron-job.org (Free)
1. Go to [Cron-job.org](https://cron-job.org/)
2. Create new cronjob
3. Set URL: `https://your-app-name.onrender.com/api/ping`
4. Set schedule: Every 10 minutes

### Option 3: Standalone Keep-Alive Script
Run this on a separate server or VPS:

```bash
# Install dependencies
npm install

# Run keep-alive script
npm run keep-alive:prod

# Or with custom settings
BACKEND_URL=https://your-app-name.onrender.com PING_INTERVAL=600000 node keep-alive.js
```

## 📊 Health Check Endpoints

### 1. Basic Health
```
GET https://your-app-name.onrender.com/
```
**Response:**
```json
{
  "status": "🎉 Exam Prep backend is live and healthy!",
  "uptime": "2h 15m",
  "totalRequests": 45,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Detailed Ping
```
GET https://your-app-name.onrender.com/api/ping
```
**Response:**
```json
{
  "status": "pong",
  "uptime": "8100s",
  "requests": 46,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "memory": {
    "rss": 123456789,
    "heapTotal": 987654321,
    "heapUsed": 456789123
  },
  "dbStatus": "connected"
}
```

### 3. Health Monitoring
```
GET https://your-app-name.onrender.com/api/health
```
**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 8100000,
  "requests": 46,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ⚠️ Important Notes

### Render Free Tier Limitations
- **Sleep after 15 minutes** of inactivity
- **Cold start** takes 30-60 seconds
- **Limited bandwidth** and compute hours

### Best Practices
1. **Use multiple monitoring services** for redundancy
2. **Set shorter intervals** (5-10 minutes) for free tier
3. **Monitor logs** in Render dashboard
4. **Consider upgrading** to paid plan for 24/7 uptime

### Troubleshooting

#### App Not Responding
1. Check Render dashboard logs
2. Verify environment variables
3. Test health endpoints manually
4. Check MongoDB connection

#### Keep-Alive Not Working
1. Verify `RENDER=true` is set
2. Check `RENDER_EXTERNAL_URL` is available
3. Review server logs for ping attempts
4. Test external monitoring services

## 🔧 Advanced Configuration

### Custom Ping Interval
```bash
# In Render environment variables
PING_INTERVAL=300000  # 5 minutes
```

### Multiple Health Checks
```bash
# Add to your monitoring setup
curl https://your-app-name.onrender.com/api/ping
curl https://your-app-name.onrender.com/api/health
curl https://your-app-name.onrender.com/
```

### Log Monitoring
Monitor these log patterns in Render dashboard:
- `🔄 Render keep-alive mechanism activated`
- `✅ Render self-ping successful`
- `❌ Render self-ping failed`

## 📈 Performance Tips

1. **Database Connection Pooling** - Already configured in `config/db.js`
2. **Response Caching** - Consider adding Redis for caching
3. **Compression** - Enable gzip compression for responses
4. **CDN** - Use Cloudflare or similar for static assets

## 🆘 Support

If you're still experiencing sleep issues:
1. Check Render status page
2. Review application logs
3. Test with multiple monitoring services
4. Consider upgrading to paid Render plan 