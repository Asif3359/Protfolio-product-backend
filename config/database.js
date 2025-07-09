const mongoose = require('mongoose');

// Connection state tracking
let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // If already connected, return existing connection
  if (isConnected) {
    return mongoose.connection;
  }

  // If connection is in progress, return the promise
  if (connectionPromise) {
    return connectionPromise;
  }

  // Create new connection promise
  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Additional serverless optimizations
    maxIdleTimeMS: 30000,
    minPoolSize: 1,
    retryWrites: true,
    w: 'majority',
  });

  try {
    await connectionPromise;
    isConnected = true;
    console.log('MongoDB Connected Successfully');
    
    // Reset connection promise on success
    connectionPromise = null;
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    isConnected = false;
    connectionPromise = null;
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
  connectionPromise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
  connectionPromise = null;
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
  isConnected = true;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = { connectDB, isConnected: () => isConnected }; 