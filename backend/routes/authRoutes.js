import express from "express";
import { login, signup, sendOtp, verifyOtp, googleLogin } from "../controllers/authController.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";
import logger from '../logger.js';

const router = express.Router();

const authRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000, // 1 min
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many authentication requests, please try again later." },
  keyType: "ip", // Use IP for auth routes to prevent abuse before login
  onLimitReached: (req) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
  },
});

router.post("/login", authRateLimiter, login);
router.post("/signup", authRateLimiter, signup);
router.post("/send-otp", authRateLimiter, sendOtp);
router.post("/verify-otp", authRateLimiter, verifyOtp);
router.post("/google-login", authRateLimiter, googleLogin);


export default router;
