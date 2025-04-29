const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./.env" });

// Load models
const Course = require("./models/Course");
const Curriculum = require("./models/Curriculum");

// Load mock data
const coursesData = require("./data/courses");
const curriculumData = require("./data/curriculum");

// Connect to DB
connectDB();

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data before seeding
    await Course.deleteMany();
    await Curriculum.deleteMany();
    console.log("Existing data destroyed...");

    await Course.insertMany(coursesData);
    console.log("Courses Imported...");

    // Insert the main curriculum document
    await Curriculum.create({
      name: "Computer Science BS", // Ensure this matches lookups in controllers
      requiredCourses: curriculumData.requiredCourses,
    });
    console.log("Curriculum Imported...");

    console.log("Data Import Success!");
    process.exit();
  } catch (err) {
    console.error("Error during data import:", err);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Course.deleteMany();
    await Curriculum.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (err) {
    console.error("Error during data destruction:", err);
    process.exit(1);
  }
};

// Handle command line arguments for seeding/destroying
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
