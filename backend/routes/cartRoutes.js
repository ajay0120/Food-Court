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

const ipRateLimiter = createHybridRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // limit each IP to 100 requests/min before auth
  message: { message: "Too many cart requests, please try again later." },
});

const cartRateLimiter = createHybridRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: { message: "Too many cart requests, please try again later." },
});

router.get("/", ipRateLimiter, protect, cartRateLimiter, getCart);
router.post("/add", ipRateLimiter, protect, cartRateLimiter, addToCart);
router.put("/update/:itemId", ipRateLimiter, protect, cartRateLimiter, updateCartItem);
router.delete("/remove/:itemId", ipRateLimiter, protect, cartRateLimiter, removeFromCart);
router.delete("/clear", ipRateLimiter, protect, cartRateLimiter, clearAll);
module.exports = router;
