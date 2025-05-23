const User =require("../models/user.js") ;
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken") ;
const OTP = require("../models/otp");
const sendMail = require("../utils/sendMail");

const signup = async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: role || "student",
    });

    res.status(201).json({ message: "User registered successfully!" });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role,email: user.email,username: user.username }, process.env.SECRET_KEY, { expiresIn: "1d" });

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
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "Email not registered" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
    await OTP.deleteMany({ email }); // Remove old OTPs
    await OTP.create({ email, otp, expiresAt });
  
    await sendMail(email, "Your OTP - Food Court BVRIT", `Your OTP is ${otp}. It expires in 5 minutes.`);
  
    res.json({ message: "OTP sent to your email" });
  };
  
  const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const existingOtp = await OTP.findOne({ email });
  
    if (!existingOtp || existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    await OTP.deleteOne({ email }); // Clean up the used OTP
  
    // ✅ Sign JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
  
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

module.exports = { signup, login,sendOtp, verifyOtp };
