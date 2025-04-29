// filepath: /Users/samir/Documents/GitHub/CSC 414 Semester Project/CSC_414_Semester_Project/controllers/userController.js
const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  // req.user is populated by the 'protect' middleware
  if (req.user) {
    res.json({
      id: req.user._id,
      studentId: req.user.studentId,
      name: req.user.name,
      email: req.user.email,
      completedCourses: req.user.completedCourses,
      interests: req.user.interests,
      createdAt: req.user.createdAt,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user interests
// @route   PUT /api/users/profile/interests
// @access  Private
exports.updateUserInterests = async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    return res
      .status(400)
      .json({ message: "Interests must be provided as an array." });
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Sanitize interests
      user.interests = interests
        .map((interest) => String(interest).trim().toLowerCase())
        .filter(Boolean);
      const updatedUser = await user.save();

      // Respond with updated user info (excluding password)
      res.json({
        id: updatedUser._id,
        studentId: updatedUser.studentId,
        name: updatedUser.name,
        email: updatedUser.email,
        completedCourses: updatedUser.completedCourses,
        interests: updatedUser.interests,
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user interests:", error);
    res.status(500).json({ message: "Server error updating interests" });
  }
};
