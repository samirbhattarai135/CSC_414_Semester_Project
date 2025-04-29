const mongoose = require("mongoose");

const CurriculumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  requiredCourses: {
    type: [String],
    default: [],
  },
});

// Index the name for efficient lookup
CurriculumSchema.index({ name: 1 });

module.exports = mongoose.model("Curriculum", CurriculumSchema);
