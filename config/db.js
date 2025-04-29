const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Ensure MONGO_URI is set in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

module.exports = connectDB;
