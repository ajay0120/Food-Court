const express = require("express");
const router = express.Router();
const { login, signup, sendOtp, verifyOtp, googleLogin } = require("../controllers/authController");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const authRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many authentication requests, please try again later." },
});

router.post("/login", authRateLimiter, login);
router.post("/signup", authRateLimiter, signup);
router.post("/send-otp", authRateLimiter, sendOtp);
router.post("/verify-otp", authRateLimiter, verifyOtp);
router.post("/google-login", authRateLimiter, googleLogin);


module.exports = router;
