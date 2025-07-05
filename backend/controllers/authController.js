const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const sendMail = require("../utils/sendMail");
const logger = require('../logger.js');

logger.info("authController loaded");

const signup = async (req, res) => {
    logger.info("Signup endpoint called");
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
        logger.warn("Signup attempt with missing fields");
        return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        logger.warn(`Signup attempt with existing email: ${email}`);
        return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists){
        logger.warn(`Signup attempt with existing username: ${username}`);
        if (usernameExists.email === email) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: role || "student",
    });
    logger.info(`New user registered: ${newUser.email}`);
    res.status(201).json({ message: "User registered successfully!" });
};

const login = async (req, res) => {
    logger.info("Login endpoint called");
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user){
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
    const existingOtp = await OTP.findOne({ email });

    if (!existingOtp || existingOtp.otp !== otp) {
        logger.warn(`Invalid or expired OTP attempt for email: ${email}`);
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        logger.warn(`OTP verified but user not found for email: ${email}`);
        return res.status(404).json({ message: "User not found" });
    }

    await OTP.deleteOne({ email }); // Clean up the used OTP
    logger.info(`OTP deleted after successful verification for email: ${email}`);

    // ✅ Sign JWT
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
};

module.exports = { signup, login, sendOtp, verifyOtp };
