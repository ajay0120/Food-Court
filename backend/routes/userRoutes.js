import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile, getUserStats } from "../controllers/userController.js";
import User from "../models/User.js";
import Order from "../models/order.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many user requests, please try again later." },
});

const userRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many user requests, please try again later." },
});

router.get("/profile", ipRateLimiter, protect, userRateLimiter, getUserProfile);

// Get user statistics
router.get("/stats", ipRateLimiter, protect, userRateLimiter, getUserStats);

export default router;
