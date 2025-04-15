const express = require("express");
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearAll,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update/:itemId", protect, updateCartItem);
router.delete("/remove/:itemId", protect, removeFromCart);
router.delete("/clear", protect, clearAll); 
module.exports = router;
