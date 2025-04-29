const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, studentId, interests } = req.body;

  try {
    if (!name || !email || !password || !studentId) {
      return res.status(400).json({
        message: "Please provide name, email, password, and student ID",
      });
    }

    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    let userByStudentId = await User.findOne({ studentId });
    if (userByStudentId) {
      return res.status(400).json({ message: "Student ID already registered" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      interests: interests || [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token: token,
      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.json({
        token: token,
        user: {
          id: user._id,
          studentId: user.studentId,
          name: user.name,
          email: user.email,
          interests: user.interests,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
