const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { MONGODB_URI } = require('./env');

const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1); // Finaliza el proceso si la conexión falla
  }
};

module.exports = { connectDatabase };