const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Please add a course ID"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Please add a course name"],
    trim: true,
  },
  prerequisites: {
    default: [],
  },

  tags: {
    type: [String],
    default: [],
  },
});

CourseSchema.index({ id: 1 });
CourseSchema.index({ tags: 1 });

module.exports = mongoose.model("Course", CourseSchema);
