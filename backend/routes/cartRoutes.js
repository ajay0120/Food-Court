import express from "express";
import { addToCart, updateCartItem, removeFromCart, getCart, clearAll } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";
import logger from '../logger.js';

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many cart requests, please try again later." },
  keyType: "ip", // only use IP for unauthenticated routes
  onLimitReached: (req) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
  },
});

const cartRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many cart requests, please try again later." },
  keyType: "user",
  skip: (req) => req.user?.role === "admin",

  onLimitReached: (req) => {
    logger.warn("Cart rate limit exceeded", {
      userId: req.user?._id?.toString(),
      role: req.user?.role,
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
      userAgent: req.headers["user-agent"],
    });
  },
});

router.get("/", ipRateLimiter, protect, cartRateLimiter, getCart);
router.post("/add", ipRateLimiter, protect, cartRateLimiter, addToCart);
router.put("/update/:itemId", ipRateLimiter, protect, cartRateLimiter, updateCartItem);
router.delete("/remove/:itemId", ipRateLimiter, protect, cartRateLimiter, removeFromCart);
router.delete("/clear", ipRateLimiter, protect, cartRateLimiter, clearAll);
export default router;
