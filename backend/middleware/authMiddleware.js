import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { USER_ROLES } from "../../common/userEnums.js";

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

export { protect, isAdmin };
