const User = require("../models/user.js");
const Food = require("../models/Food.js");
const logger = require('../logger.js');

logger.info("cartController loaded");

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    logger.info(`Cart fetched for user: ${req.user.id}`);
    res.json(user.cart);
  } catch (error) {
    logger.error(`Error fetching cart for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
      logger.info(`Increased quantity for product ${productId} in user ${req.user.id}'s cart`);
    } else {
      user.cart.push({ product: productId, quantity: 1 });
      logger.info(`Added product ${productId} to user ${req.user.id}'s cart`);
    }

    await user.save();
    res.json({ message: "Added to cart" });
  } catch (error) {
    logger.error(`Error adding to cart for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const item = user.cart.find((i) => i.product.toString() === itemId);
    if (item) {
      item.quantity = quantity;
      await user.save();
      logger.info(`Updated quantity for product ${itemId} in user ${req.user.id}'s cart to ${quantity}`);
      return res.json({ message: "Cart updated" });
    }

    logger.warn(`Attempt to update non-existent item ${itemId} in user ${req.user.id}'s cart`);
    res.status(404).json({ message: "Item not found" });
  } catch (error) {
    logger.error(`Error updating cart item for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn(`Remove from cart failed: user ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if item exists in cart
    const itemExists = user.cart.some((item) => item.product.toString() === itemId);
    if (!itemExists) {
      logger.warn(`Attempt to remove non-existent item ${itemId} from user ${req.user.id}'s cart`);
      return res.status(400).json({ message: "Item not found in cart" });
    }

    // Remove item from cart
    user.cart = user.cart.filter((item) => item.product.toString() !== itemId);

    // Mark cart as modified if needed
    user.markModified("cart");

    await user.save();

    logger.info(`Removed product ${itemId} from user ${req.user.id}'s cart`);
    res.json({ message: "Removed from cart" });
  } catch (error) {
    logger.error(`Error removing from cart for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      logger.warn(`Clear cart failed: user ${req.user.id} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the user's cart
    user.cart = [];
    await user.save();

    logger.info(`Cleared cart for user ${req.user.id}`);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    logger.error(`Error clearing cart for user ${req.user.id}: ${err.message}`);
    res.status(500).json({ message: "Error clearing cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearAll };
