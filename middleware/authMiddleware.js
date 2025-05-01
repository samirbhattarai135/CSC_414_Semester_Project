const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  console.log("Protect Middleware: Checking headers..."); // Log entry

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Protect Middleware: Finding user by ID..."); // Log before DB query
      req.user = await User.findById(decoded.id).select("-password"); // Exclude password

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Protect Middleware Error:", error); // Log any error

      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed verification" });
      } else if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Not authorized, token expired" });
      } else {
        return res.status(401).json({ message: "Not authorized, token error" });
      }
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
