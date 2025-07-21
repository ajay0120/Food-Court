const express = require("express");
const router = express.Router();
const { login, signup, sendOtp, verifyOtp, googleLogin } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", googleLogin);


module.exports = router;
