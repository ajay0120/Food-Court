const express = require("express");
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require("../controllers/menuController.js");
const { protect, isAdmin } = require("../middleware/authMiddleware.js");


const router = express.Router();

// Public route to view menu
router.get("/", getMenu);

// Admin-only routes
router.post("/", protect, isAdmin, addMenuItem);
router.put("/:id", protect, isAdmin, updateMenuItem);
router.delete("/:id", protect, isAdmin, deleteMenuItem);

module.exports = router;

