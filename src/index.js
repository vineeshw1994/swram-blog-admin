// src/app.js
const express = require('express');
require('dotenv').config();
const sequelize = require('./db');

const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());

// Extract user from headers
app.use((req, res, next) => {
  if (req.headers['x-user-id']) {
    req.user = {
      id: parseInt(req.headers['x-user-id']),
      role: req.headers['x-user-role'] || 'user',
    };
  }
  next();
});

// Routes
app.use('/', postRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok', 
      service: 'Admin Service',
      database: 'connected',
      time: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      service: 'Admin Service',
      database: 'disconnected',
      error: error.message,
      time: new Date().toISOString() 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => res.send('Admin Service OK'));

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
  console.log(`Admin Service @ :${PORT}`);
  
  // Safe database sync - only in development or if explicitly enabled
  if (process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true') {
    try {
      console.log('🔄 Checking database tables...');
      await sequelize.sync({ 
        alter: process.env.DB_SYNC === 'alter',
        force: false // Never force in production
      });
      console.log('✅ Database tables ready');
    } catch (err) {
      console.error('❌ DB sync error:', err.message);
      // Don't crash the app for sync errors in production
      if (process.env.NODE_ENV !== 'production') {
        throw err;
      }
    }
  } else {
    console.log('ℹ️  Database sync disabled - using existing tables');
  }
});