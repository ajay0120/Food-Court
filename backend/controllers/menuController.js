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
    const newItem = new Food(req.body);
    const savedItem = await newItem.save();
    console.log("REQ.USER:", req.user);
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
