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

// Health
app.get('/', (req, res) => res.send('Post Service OK'));

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
  console.log(`Post Service @ :${PORT}`);
  try {
    await sequelize.sync({ alter: true });
    console.log('Posts table ready');
  } catch (err) {
    console.error('DB sync error:', err);
  }
});