const Food = require("../models/Food");
const logger = require('../logger.js');

logger.info("menuController loaded");

// GET all menu items
const getMenu = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, type, category  } = req.query;
    // console.log("type in backend is=",type);
    // console.log("category in backend is=",category);
    const query = {};
    // console.log("type && type!==All",(type && type!==All));
    if(type && type!=="All"){
      // console.log("I have reached here",type);
      query.type = type;
    }
    // Filter by category if provided
    if (category && category !== "All") {
      query.category = category;
    }

    // Search by name if provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    // Fetch filtered & paginated items
    const items = await Food.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select("name price category img type inStock");
    // console.log(items);
    // Count total items for pagination
    const totalItems = await Food.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    logger.info(`Fetched menu items (page: ${page}, limit: ${limit}, type: ${type}, category: ${category}, search: ${search})`);

    res.status(200).json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("Error fetching menu: " + error.message);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};


// ADD new menu item (admin only)
const addMenuItem = async (req, res) => {
    try {
      let { name, desc, img, price, type, category } = req.body;
  
      if (!name || !desc || !price?.org) {
        logger.warn("Attempt to add menu item with missing fields");
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
        logger.warn(`Duplicate food item add attempt: ${normalizedName} [${category.join(", ")}]`);
        return res.status(400).json({ message: "Duplicate food item with same name and categories already exists" });
      }
  
      // Create and save new food item
      const newItem = new Food({
        name: normalizedName,
        desc,
        img,
        price,
        type,
        category
      });
      logger.info(`New menu item created: ${normalizedName} [${category.join(", ")}]`);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      logger.error("Error adding menu items: " + error.message);
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
    if (!updatedItem) {
      logger.warn(`Menu item not found: ${req.params.id}`);
      return res.status(404).json({ message: "Menu item not found" });
    }
    logger.info(`Menu item updated: ${updatedItem.name} [${updatedItem.category.join(", ")}]`);
    res.status(200).json(updatedItem);
  } catch (error) {
    logger.error("Error updating menu item: " + error.message);
    res.status(400).json({ message: "Error updating menu item" });
  }
};

// DELETE menu item (admin only)
const deleteMenuItem = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    logger.info(`Menu item deleted: ${req.params.id}`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    logger.error("Error deleting menu item: " + error.message);
    res.status(400).json({ message: "Error deleting menu item" });
  }
};

module.exports = {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
