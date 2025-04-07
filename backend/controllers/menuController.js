const Food = require("../models/Food.js");


// @desc Get all menu items
const getMenu = async (req, res) => {
  const items = await Food.find({});
  res.json(items);
};

// @desc Add a new food item (Admin only)
const addMenuItem = async (req, res) => {
  const { name, desc, img, price, category } = req.body;

  if (!name || !desc || !price?.org)
    return res.status(400).json({ message: "Name, description, and price are required" });

  const newItem = await Food.create({ name, desc, img, price, category });
  res.status(201).json({ message: "Item added", newItem });
};

// @desc Update food item (Admin only)
const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const updated = await Food.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ message: "Item updated", updated });
};

// @desc Delete food item (Admin only)
const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  await Food.findByIdAndDelete(id);
  res.json({ message: "Item deleted" });
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };

