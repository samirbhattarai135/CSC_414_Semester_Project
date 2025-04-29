const User = require("../models/User");

// Import DB models instead of mock data files
const Course = require("../models/Course");
const Curriculum = require("../models/Curriculum");

const {
  generateRecommendation,
  validatePrerequisites,
} = require("../services/recommendationService");

const checkAuthorization = (req, studentIdParam) => {
  if (req.user.studentId !== studentIdParam) {
    console.warn(
      `Authorization failed: User ${req.user.studentId} (ID: ${req.user._id}) tried to access data for student ${studentIdParam}`
    );
    return false;
  }
  return true;
};

// @desc    Get completed courses for a specific student
// @route   GET /api/students/:studentId/courses
// @access  Private
exports.getStudentCourses = async (req, res) => {
  const studentIdParam = req.params.studentId;

  if (!checkAuthorization(req, studentIdParam)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this student's data." });
  }

  try {
    // The authenticated user is available in req.user
    const user = req.user;
    res.json(user.completedCourses || []);
  } catch (error) {
    console.error(
      `Error fetching courses for student ${studentIdParam}:`,
      error
    );
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a course to a student's completed list
// @route   POST /api/students/:studentId/courses
// @access  Private
exports.addStudentCourse = async (req, res) => {
  const studentIdParam = req.params.studentId;
  const { courseId } = req.body;

  if (!checkAuthorization(req, studentIdParam)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot modify this student's data." });
  }

  if (!courseId) {
    return res
      .status(400)
      .json({ message: "Missing required field: courseId" });
  }

  try {
    const user = req.user;

    if (user.completedCourses.includes(courseId)) {
      return res.status(400).json({
        message: `Course ${courseId} already exists in completed list.`,
      });
    }

    user.completedCourses.push(courseId);
    await user.save();

    res
      .status(201)
      .json({ courseId: courseId, completedCourses: user.completedCourses });
  } catch (error) {
    console.error(`Error adding course for student ${studentIdParam}:`, error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update details about a specific completed course (IF schema changes)
// @route   PUT /api/students/:studentId/courses/:courseId
// @access  Private
exports.updateStudentCourse = async (req, res) => {
  const { studentId, courseId } = req.params;

  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot modify this student's data." });
  }

  // NOTE: This function doesn't make sense if completedCourses only stores string IDs.
  return res.status(501).json({
    message:
      "Updating course details not implemented for current schema (stores only IDs).",
  });
};

// @desc    Delete a course from a student's completed list
// @route   DELETE /api/students/:studentId/courses/:courseId
// @access  Private
exports.deleteStudentCourse = async (req, res) => {
  const { studentId, courseId } = req.params;

  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot modify this student's data." });
  }

  try {
    const user = req.user;
    const initialLength = user.completedCourses.length;

    user.completedCourses = user.completedCourses.filter(
      (cId) => cId !== courseId
    );

    if (user.completedCourses.length === initialLength) {
      return res
        .status(404)
        .json({ message: `Course ${courseId} not found in completed list.` });
    }

    await user.save();
    res.json({
      message: `Course ${courseId} removed successfully`,
      completedCourses: user.completedCourses,
    });
  } catch (error) {
    console.error(
      `Error deleting course ${courseId} for student ${studentId}:`,
      error
    );
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get course suggestions for next semester
// @route   GET /api/students/:studentId/suggestions
// @access  Private
exports.getCourseSuggestions = async (req, res) => {
  const studentId = req.params.studentId;
  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this student's data." });
  }

  try {
    const completedCourses = req.user.completedCourses || [];

    const allCourses = await Course.find({});
    const curriculum = await Curriculum.findOne({
      name: "Computer Science BS",
    });

    if (!allCourses || allCourses.length === 0) {
      console.warn("No courses found in the database.");
      return res.status(404).json({ message: "Course data not available." });
    }
    if (!curriculum) {
      console.warn(
        'Curriculum "Computer Science BS" not found in the database.'
      );
      return res
        .status(404)
        .json({ message: "Curriculum data not available." });
    }

    const recommendations = generateRecommendation(
      completedCourses,
      allCourses,
      curriculum
    );

    res.json({ suggestions: recommendations });
  } catch (error) {
    console.error(
      `Error generating course suggestions for student ${studentId}:`,
      error
    );
    res.status(500).json({ message: "Server error generating suggestions" });
  }
};

// @desc    Get elective recommendations based on interests
// @route   GET /api/students/:studentId/recommendations
// @access  Private
exports.getElectiveRecommendations = async (req, res) => {
  const studentId = req.params.studentId;
  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this student's data." });
  }

  try {
    const userInterests = req.user.interests || [];
    const completedCourses = req.user.completedCourses || [];

    const allCourses = await Course.find({});
    const curriculum = await Curriculum.findOne({
      name: "Computer Science BS",
    });

    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({ message: "Course data not available." });
    }
    if (!curriculum) {
      return res
        .status(404)
        .json({ message: "Curriculum data not available." });
    }

    // 1. Identify potential elective courses (not required and not completed)
    const potentialElectives = allCourses.filter(
      (course) =>
        !curriculum.requiredCourses.includes(course.id) &&
        !completedCourses.includes(course.id)
    );

    // 2. Filter electives based on met prerequisites
    const eligibleElectives = potentialElectives.filter((course) =>
      validatePrerequisites(course.id, completedCourses, allCourses)
    );

    // 3. Filter eligible electives based on matching interests (tags)
    let recommendedElectives = [];
    if (userInterests.length > 0) {
      recommendedElectives = eligibleElectives.filter(
        (course) =>
          course.tags &&
          course.tags.some((tag) => userInterests.includes(tag.toLowerCase())) // Case-insensitive match
      );
    } else {
      // If user has no interests specified, recommend any eligible elective
      recommendedElectives = eligibleElectives;
    }

    const recommendationIds = recommendedElectives.map((course) => course.id);
    const MAX_ELECTIVE_RECOMMENDATIONS = 3;

    res.json({
      recommendations: recommendationIds.slice(0, MAX_ELECTIVE_RECOMMENDATIONS),
    });
  } catch (error) {
    console.error(
      `Error generating elective recommendations for student ${studentId}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Server error generating recommendations" });
  }
};

// @desc    Get estimated graduation date
// @route   GET /api/students/:studentId/graduation-estimate
// @access  Private
exports.getGraduationEstimate = async (req, res) => {
  const studentId = req.params.studentId;
  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this student's data." });
  }

  try {
    const completedCourses = req.user.completedCourses || [];
    const curriculum = await Curriculum.findOne({
      name: "Computer Science BS",
    });
    if (!curriculum) {
      console.warn(
        'Curriculum "Computer Science BS" not found in the database.'
      );
      return res
        .status(404)
        .json({ message: "Curriculum data not available." });
    }

    // TODO: Implement actual graduation estimation logic here
    // 1. Calculate remaining required courses
    // 2. Estimate semesters needed based on average load
    // 3. Calculate estimated date
    console.log(
      `Placeholder: Calculating graduation estimate for student ${studentId} using courses: ${completedCourses}`
    );
    res.json({ estimatedDate: "Spring 2028 (DB Placeholder)" }); // Placeholder response
  } catch (error) {
    console.error(
      `Error estimating graduation for student ${studentId}:`,
      error
    );
    res.status(500).json({ message: "Server error estimating graduation" });
  }
};

// @desc    Get course completion progress data
// @route   GET /api/students/:studentId/progress
// @access  Private
exports.getProgressData = async (req, res) => {
  const studentId = req.params.studentId;
  if (!checkAuthorization(req, studentId)) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access this student's data." });
  }

  try {
    const completedCourses = req.user.completedCourses || [];
    const curriculum = await Curriculum.findOne({
      name: "Computer Science BS",
    });
    if (!curriculum) {
      console.warn(
        'Curriculum "Computer Science BS" not found for progress calculation.'
      );
      return res
        .status(404)
        .json({ message: "Curriculum data not available." });
    }

    // Count how many of the *required* courses are in the completed list
    const completedRequiredCount = curriculum.requiredCourses.filter((reqId) =>
      completedCourses.includes(reqId)
    ).length;

    const totalRequiredCount = curriculum.requiredCourses.length;

    res.json({
      completedRequiredCount,
      totalRequiredCount,
      totalCompletedCount: completedCourses.length,
    });
  } catch (error) {
    console.error(
      `Error fetching progress data for student ${studentId}:`,
      error
    );
    res.status(500).json({ message: "Server error fetching progress data" });
  }
};
