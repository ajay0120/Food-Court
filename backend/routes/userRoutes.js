const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile, getUserStats } = require("../controllers/userController");
const User = require("../models/User");
const Order = require("../models/order");

router.get("/profile", protect, getUserProfile);

// Get user statistics
router.get("/stats", protect, getUserStats);

module.exports = router;
