const express = require("express");
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, permanentDeleteMenuItem, restoreDeletedItem, getDeletedMenuItems } = require("../controllers/menuController.js");
const { protect, isAdmin } = require("../middleware/authMiddleware.js");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const router = express.Router();

const menuRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many menu requests, please try again later." },
});

// Public route to view menu
router.get("/", menuRateLimiter, getMenu);

// Admin-only routes
router.get("/deleted", protect, isAdmin, menuRateLimiter, getDeletedMenuItems);
router.post("/", protect, isAdmin, menuRateLimiter, addMenuItem);
router.put("/:id", protect, isAdmin, menuRateLimiter, updateMenuItem);
router.delete("/:id", protect, isAdmin, menuRateLimiter, permanentDeleteMenuItem);
router.patch("/:id", protect, isAdmin, menuRateLimiter, deleteMenuItem);
router.patch("/:id/restore", protect, isAdmin, menuRateLimiter, restoreDeletedItem);
module.exports = router;

