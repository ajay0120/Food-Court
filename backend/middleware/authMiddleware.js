const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  console.log("is token invalid "+(!token));
  // console.log(token);
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    console.log(jwt.verify(token, process.env.SECRET_KEY));
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //req.user = await User.findById(decoded.id).select("-password");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

module.exports = { protect, isAdmin };
