// filepath: /Users/samir/Documents/GitHub/CSC 414 Semester Project/CSC_414_Semester_Project/routes/userRoutes.js
const express = require("express");
const {
  getUserProfile,
  updateUserInterests,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All user routes are protected
router.use(protect);

router.route("/profile").get(getUserProfile);

router.route("/profile/interests").put(updateUserInterests);

module.exports = router;
