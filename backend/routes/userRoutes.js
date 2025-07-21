const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/user");
const Order = require("../models/order");

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Get user statistics
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching stats for user ID:", userId);

    // Get user creation date - using the current user object since we already have it
    const user = req.user;
    
    // Count total orders for this user
    const totalOrders = await Order.countDocuments({ user: userId });
    console.log("Total orders found:", totalOrders);
    
    // Format member since date
    const memberSince = user.createdAt 
      ? user.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "Recently"; // Fallback if no creation date
    
    console.log("Member since:", memberSince);

    res.json({
      memberSince,
      totalOrders,
      accountStatus: "Active", // You can make this dynamic based on user status
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
