const express = require("express");
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, permanentDeleteMenuItem, restoreDeletedItem, getDeletedMenuItems } = require("../controllers/menuController.js");
const { protect, isAdmin } = require("../middleware/authMiddleware.js");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const router = express.Router();

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many menu requests, please try again later." },
});

const menuRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many menu requests, please try again later." },
});

// Public route to view menu
router.get("/", menuRateLimiter, getMenu);

// Admin-only routes
router.get("/deleted", ipRateLimiter, protect, isAdmin, menuRateLimiter, getDeletedMenuItems);
router.post("/", ipRateLimiter, protect, isAdmin, menuRateLimiter, addMenuItem);
router.put("/:id", ipRateLimiter, protect, isAdmin, menuRateLimiter, updateMenuItem);
router.delete("/:id", ipRateLimiter, protect, isAdmin, menuRateLimiter, permanentDeleteMenuItem);
router.patch("/:id", ipRateLimiter, protect, isAdmin, menuRateLimiter, deleteMenuItem);
router.patch("/:id/restore", ipRateLimiter, protect, isAdmin, menuRateLimiter, restoreDeletedItem);
module.exports = router;

