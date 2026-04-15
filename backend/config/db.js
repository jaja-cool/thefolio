// backend/config/db.js
const mongoose = require('mongoose');
const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Timeout after 5s if cannot reach any servers
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection retry ${6-retries}/5 failed:`, error.message);
      retries -= 1;
      if (!retries) {
        console.error('Database connection failed after 5 retries. Exiting.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
    }
  }
};
module.exports = connectDB;
