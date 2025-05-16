const User = require("../models/user.js");
const Food = require("../models/Food.js");

const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate("cart.product");
  res.json(user.cart);
};

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  const existingItem = user.cart.find((item) => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();
  res.json({ message: "Added to cart" });
};

const updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const user = await User.findById(req.user.id);

  const item = user.cart.find((i) => i.product.toString() === itemId);
  if (item) {
    item.quantity = quantity;
    await user.save();
    return res.json({ message: "Cart updated" });
  }

  res.status(404).json({ message: "Item not found" });
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if item exists in cart
    const itemExists = user.cart.some((item) => item.product.toString() === itemId);
    if (!itemExists) return res.status(400).json({ message: "Item not found in cart" });

    // Remove item from cart
    user.cart = user.cart.filter((item) => item.product.toString() !== itemId);

    // Mark cart as modified if needed
    user.markModified("cart");

    await user.save();
    
    res.json({ message: "Removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const clearAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Clear the user's cart
    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Error clearing cart" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart,clearAll };
