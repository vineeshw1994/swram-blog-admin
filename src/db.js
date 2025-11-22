// src/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB || 'blogdb',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || 'Vineesh@123', 
  {
    host: process.env.MYSQL_HOST || 'host.docker.internal',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development', // Only log in development
    pool: { 
      max: 5, 
      min: 0, 
      acquire: 30000, 
      idle: 10000 
    },
    retry: {
      max: 5,
      timeout: 30000
    }
  }
);

// Connection with retry logic for production
const connectDB = async (maxRetries = 5, retryDelay = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅ MySQL connected successfully');
      return true;
    } catch (error) {
      console.error(`❌ MySQL connection attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('💥 All database connection attempts failed');
        return false;
      }
      
      console.log(`🔄 Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Initialize connection
connectDB();

module.exports = sequelize;