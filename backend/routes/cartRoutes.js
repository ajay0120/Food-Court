const express = require("express");
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearAll,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const {createHybridRateLimiter} = require("../middleware/rateLimitingMiddleware");

const router = express.Router();

const cartRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many cart requests, please try again later." },
});

router.get("/", protect, cartRateLimiter, getCart);
router.post("/add", protect, cartRateLimiter, addToCart);
router.put("/update/:itemId", protect, cartRateLimiter, updateCartItem);
router.delete("/remove/:itemId", protect, cartRateLimiter, removeFromCart);
router.delete("/clear", protect, cartRateLimiter, clearAll);
module.exports = router;
