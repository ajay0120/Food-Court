const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const sendMail = require("../utils/sendMail");
const logger = require('../logger.js');
const resendOtp = require("../utils/reSendOpt.js");
const { OAuth2Client } = require('google-auth-library');

logger.info("authController loaded");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
    logger.info("Signup endpoint called");
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
        logger.warn("Signup attempt with missing fields");
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });

        // 🚫 Case 1: User already verified
        if (existingUser && existingUser.verified) {
            logger.warn(`Signup attempt for already verified email: ${email}`);
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // 🔁 Case 2: User exists but not verified → resend OTP and continue
        if (existingUser && !existingUser.verified) {
            logger.info(`User exists but not verified. Resending OTP to ${email}`);
            await resendOtp(email); // Create a helper function for this
            logger.info(`OTP resent to ${email}`);
            return res.status(200).json({ message: "User already exists but not verified. OTP resent." });
        }

        // ✅ Case 3: New user → Create user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            role: role || "student",
            verified: false,
            otpTries: 0,
        });

        logger.info(`New user created: ${email}`);

        await resendOtp(email); // Same function as above
        logger.info(`OTP sent to ${email} for verification`);
        res.status(201).json({ message: "Signup successful. OTP sent to email." });

    } catch (err) {
        logger.error(`Signup failed for ${email}: ${err.message}`);
        res.status(500).json({ message: "Signup failed. Try again later." });
    }
};


const login = async (req, res) => {
    logger.info("Login endpoint called");
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Login attempt with non-existing email: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login attempt with incorrect password for email: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, username: user.username }, process.env.SECRET_KEY, { expiresIn: "1d" });

        logger.info(`Login successful for email: ${email}`);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                img: user.img,
            },
        });
    }
    catch (error) {
        logger.error(`Login error for email: ${email} - ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

// Send OTP
const sendOtp = async (req, res) => {
    logger.info("Send OTP endpoint called");
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        logger.warn(`OTP request for non-registered email: ${email}`);
        return res.status(404).json({ message: "Email not registered" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OTP.deleteMany({ email }); // Remove old OTPs
    logger.info(`Old OTPs deleted for email: ${email}`);
    await OTP.create({ email, otp, expiresAt });
    logger.info(`New OTP created for email: ${email}`);

    await sendMail(email, "Your OTP - Food Court BVRIT", `Your OTP is ${otp}. It expires in 5 minutes.`);
    logger.info(`OTP sent to ${email}`);
    res.json({ message: "OTP sent to your email" });
};

const verifyOtp = async (req, res) => {
    logger.info("Verify OTP endpoint called");
    const { email, otp } = req.body;

    try {
        const existingOtp = await OTP.findOne({ email });

        if (!existingOtp || existingOtp.otp !== otp || existingOtp.expiresAt < new Date()) {
            logger.warn(`Invalid or expired OTP attempt for email: ${email}`);
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`OTP verified but user not found for email: ${email}`);
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Mark user as verified
        user.verified = true;
        await user.save();

        await OTP.deleteOne({ email }); // Clean up the used OTP
        logger.info(`OTP deleted after successful verification for email: ${email}`);

        // ✅ Issue JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        logger.info(`OTP verified and JWT issued for email: ${email}`);

        res.json({
            message: "OTP verified successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                img: user.img,
            },
        });

    } catch (error) {
        logger.error(`Error in verifyOtp for email: ${email} - ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

// Google OAuth Login
const googleLogin = async (req, res) => {
    logger.info("Google login endpoint called");
    
    try {
        const { credential } = req.body;
        
        if (!credential) {
            logger.warn("Google login attempt without credential");
            return res.status(400).json({ message: "Google credential is required" });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture, email_verified } = payload;

        if (!email_verified) {
            logger.warn(`Google login attempt with unverified email: ${email}`);
            return res.status(400).json({ message: "Google email not verified" });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.verified = true; // Google accounts are pre-verified
                await user.save();
                logger.info(`Updated existing user with Google ID: ${email}`);
            }
        } else {
            // Create new user
            const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
            
            user = await User.create({
                name,
                username,
                email,
                googleId,
                verified: true,
                role: 'student',
                profilePicture: picture
            });
            
            logger.info(`Created new user via Google OAuth: ${email}`);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        logger.info(`Google login successful for: ${email}`);
        
        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        logger.error(`Google login error: ${error.message}`);
        res.status(500).json({ message: "Google authentication failed" });
    }
};


module.exports = { signup, login, sendOtp, verifyOtp, googleLogin };
