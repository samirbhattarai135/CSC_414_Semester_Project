require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const connectDB = require("../config/db"); // Correct path relative to services/

const authRoutes = require("../routes/authRoutes");
const studentRoutes = require("../routes/studentRoutes");
const userRoutes = require("../routes/userRoutes"); // Import user routes

// Connect to Database
connectDB();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);

// Basic root route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
