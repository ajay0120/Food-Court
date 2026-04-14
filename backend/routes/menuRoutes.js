import express from "express";
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, permanentDeleteMenuItem, restoreDeletedItem, getDeletedMenuItems } from "../controllers/menuController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createHybridRateLimiter } from "../middleware/rateLimitingMiddleware.js";
import logger from '../logger.js';

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many menu requests, please try again later." },
  keyType: "ip", // only use IP for unauthenticated routes
  onLimitReached: (req) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      route: req.originalUrl,
      method: req.method,
    });
  },
});

// Public route to view menu
router.get("/" , getMenu);

// Admin-only routes
router.get("/deleted", ipRateLimiter, protect, isAdmin, getDeletedMenuItems);
router.post("/", ipRateLimiter, protect, isAdmin , addMenuItem);
router.put("/:id", ipRateLimiter, protect, isAdmin, updateMenuItem);
router.delete("/:id", ipRateLimiter, protect, isAdmin, permanentDeleteMenuItem);
router.patch("/:id", ipRateLimiter, protect, isAdmin, deleteMenuItem);
router.patch("/:id/restore", ipRateLimiter, protect, isAdmin, restoreDeletedItem);
export default router;

