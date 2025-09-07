const express = require("express");
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, permanentDeleteMenuItem, restoreDeletedItem, getDeletedMenuItems } = require("../controllers/menuController.js");
const { protect, isAdmin } = require("../middleware/authMiddleware.js");


const router = express.Router();

// Public route to view menu
router.get("/", getMenu);

// Admin-only routes
router.get("/deleted", protect, isAdmin, getDeletedMenuItems);
router.post("/", protect, isAdmin, addMenuItem);
router.put("/:id", protect, isAdmin, updateMenuItem);
router.delete("/:id", protect, isAdmin, permanentDeleteMenuItem);
router.patch("/:id", protect, isAdmin, deleteMenuItem);
router.patch("/:id/restore", protect, isAdmin, restoreDeletedItem);
module.exports = router;

