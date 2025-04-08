const Food = require("../models/Food");

// GET all menu items
const getMenu = async (req, res) => {
  try {
    const items = await Food.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items" });
  }
};

// ADD new menu item (admin only)
const addMenuItem = async (req, res) => {
    try {
      let { name, desc, img, price, category } = req.body;
  
      if (!name || !desc || !price?.org) {
        return res.status(400).json({ message: "Name, description, and price are required" });
      }
  
      // Normalize category values to lowercase
      category = category.map((cat) => cat.trim().toLowerCase());
  
      // Also normalize name (optional, depends on your logic)
      const normalizedName = name.trim().toLowerCase();
  
      // Check for exact duplicate: same name and same categories (same length and same values)
      const existingItem = await Food.findOne({
        name: normalizedName,
        category: { $all: category, $size: category.length }
      });
  
      if (existingItem) {
        return res.status(400).json({ message: "Duplicate food item with same name and categories already exists" });
      }
  
      // Create and save new food item
      const newItem = new Food({
        name: normalizedName,
        desc,
        img,
        price,
        category
      });
  
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      res.status(400).json({ message: "Error adding menu item" });
    }
  };
  
  

// UPDATE menu item (admin only)
const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: "Error updating menu item" });
  }
};

// DELETE menu item (admin only)
const deleteMenuItem = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting menu item" });
  }
};

module.exports = {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
