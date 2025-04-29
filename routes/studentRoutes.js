// filepath: csc414-backend/routes/studentRoutes.js
const express = require("express");
const {
  getStudentCourses,
  addStudentCourse,
  updateStudentCourse,
  deleteStudentCourse,
  getCourseSuggestions,
  getElectiveRecommendations,
  getGraduationEstimate,
  getProgressData,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/:studentId/courses")
  .get(getStudentCourses)
  .post(addStudentCourse);

router
  .route("/:studentId/courses/:courseId")
  .put(updateStudentCourse)
  .delete(deleteStudentCourse);

// Routes for additional features
router.get("/:studentId/suggestions", getCourseSuggestions);
router.get("/:studentId/recommendations", getElectiveRecommendations);
router.get("/:studentId/graduation-estimate", getGraduationEstimate);
router.get("/:studentId/progress", getProgressData);

module.exports = router;
