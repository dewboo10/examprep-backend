#!/usr/bin/env node

/**
 * Keep-Alive Script for Exam Prep Backend
 * 
 * This script pings the backend server every 14 minutes to prevent it from sleeping.
 * You can run this script on a separate server or use it with external monitoring services.
 * 
 * Usage:
 * - node keep-alive.js
 * - Set environment variables: BACKEND_URL, PING_INTERVAL
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'https://parikshaprep.in';
const PING_INTERVAL = parseInt(process.env.PING_INTERVAL) || 10 * 60 * 1000; // 10 minutes for Render
const PING_ENDPOINT = '/api/ping';

console.log('🔄 Keep-Alive Script Started (Render Optimized)');
console.log(`📍 Backend URL: ${BACKEND_URL}`);
console.log(`⏰ Ping Interval: ${PING_INTERVAL / 1000} seconds (optimized for Render)`);
console.log(`🎯 Endpoint: ${PING_ENDPOINT}`);
console.log(`🌐 Platform: Render`);

let successCount = 0;
let failureCount = 0;
let lastPingTime = null;

const pingServer = () => {
  const url = new URL(BACKEND_URL + PING_ENDPOINT);
  const protocol = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'GET',
    timeout: 10000, // 10 second timeout
    headers: {
      'User-Agent': 'ExamPrep-KeepAlive/1.0'
    }
  };

  const req = protocol.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        successCount++;
        lastPingTime = new Date().toISOString();
        
        console.log(`✅ Ping successful (${successCount}) - ${new Date().toISOString()}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Uptime: ${response.uptime}`);
        console.log(`   Requests: ${response.requests}`);
        console.log(`   DB Status: ${response.dbStatus}`);
      } catch (error) {
        console.log(`⚠️  Ping successful but invalid JSON response - ${new Date().toISOString()}`);
        console.log(`   Response: ${data.substring(0, 100)}...`);
      }
    });
  });

  req.on('error', (error) => {
    failureCount++;
    console.log(`❌ Ping failed (${failureCount}) - ${new Date().toISOString()}`);
    console.log(`   Error: ${error.message}`);
  });

  req.on('timeout', () => {
    failureCount++;
    console.log(`⏰ Ping timeout (${failureCount}) - ${new Date().toISOString()}`);
    req.destroy();
  });

  req.end();
};

// Initial ping
console.log('🚀 Starting initial ping...');
pingServer();

// Schedule regular pings
setInterval(() => {
  console.log(`\n🔄 Scheduled ping at ${new Date().toISOString()}`);
  pingServer();
}, PING_INTERVAL);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Keep-Alive Script Stopped');
  console.log(`📊 Final Stats:`);
  console.log(`   Successful pings: ${successCount}`);
  console.log(`   Failed pings: ${failureCount}`);
  console.log(`   Last ping: ${lastPingTime || 'Never'}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Keep-Alive Script Terminated');
  process.exit(0);
});

// Log stats every hour
setInterval(() => {
  console.log(`\n📊 Hourly Stats:`);
  console.log(`   Successful pings: ${successCount}`);
  console.log(`   Failed pings: ${failureCount}`);
  console.log(`   Success rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(1)}%`);
  console.log(`   Last ping: ${lastPingTime || 'Never'}`);
}, 60 * 60 * 1000); // Every hour 