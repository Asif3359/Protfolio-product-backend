const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('MongoDB Connected');
};

module.exports = connectToDatabase;
