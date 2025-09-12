const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile, getUserStats } = require("../controllers/userController");
const User = require("../models/User");
const Order = require("../models/order");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const router = express.Router();

const userRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many user requests, please try again later." },
});

router.get("/profile", protect, userRateLimiter, getUserProfile);

// Get user statistics
router.get("/stats", protect, userRateLimiter, getUserStats);

module.exports = router;
