import Food from "../models/Food.js";
import logger from '../logger.js';
import { validateRequiredString, validateObjectId, buildValidationError } from '../utils/validation.js';
// Whitelists for validation (fall back to array if require fails)
let FOOD_TYPES = ["veg", "non-veg"]; // default
let FOOD_CATEGORIES = ["Indian","Chinese","Snack","Beverage","Dessert","Continental","American"];
// Import enums directly (ESM)
import * as FoodEnums from '../../common/foodEnums.js';
FOOD_TYPES = FoodEnums.FOOD_TYPES || FOOD_TYPES;
FOOD_CATEGORIES = FoodEnums.FOOD_CATEGORIES || FOOD_CATEGORIES;

logger.info("menuController loaded");

// GET all menu items
const getMenu = async (req, res) => {
  try {
    let { page = 1, limit = 20, search, type, category } = req.query;
    // Validate & normalize pagination
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100; // hard cap

    // Basic whitelist for type (if provided)
    if (type && typeof type === 'string') {
      type = type.trim();
      if (type.length > 40) {
        return res.status(400).json(buildValidationError("Invalid type length", { type }));
      }
    }

    // Escape regex special chars in search to avoid ReDoS patterns
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    // console.log("type in backend is=",type);
    // console.log("category in backend is=",category);
    const query = {};
    // console.log("type && type!==All",(type && type!==All));
    if (type && type !== "All") {
      const normalizedType = type.toLowerCase();
      if (!Object.values(FOOD_TYPES).includes(normalizedType)) {
        return res.status(400).json(buildValidationError("Invalid type value", { type }));
      }
      query.type = normalizedType;
    }
    // Filter by category if provided
    if (category && category !== "All" && category !== "all") {
      // Handle multiple categories (comma-separated)
      const categoriesRaw = category.split(',').map(cat => cat.trim()).filter(cat => cat);
      if (categoriesRaw.length > 0) {
        const normalized = categoriesRaw.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());
        const invalid = normalized.filter(c => !Object.values(FOOD_CATEGORIES).includes(c));
        if (invalid.length) {
          return res.status(400).json(buildValidationError("Invalid category value(s)", { invalid }));
        }
        query.category = { $in: normalized };
      }
    }

    // Search by name if provided
    if (search && typeof search === 'string') {
      const safeSearch = escapeRegex(search.trim()).slice(0, 100); // limit length
      if (safeSearch.length > 0) {
        query.name = { $regex: safeSearch, $options: "i" };
      }
    }

    //add only non-deleted items
    query.isDeleted = false;

    // Count first to validate requested page
    const totalItems = await Food.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    if (page > totalPages) {
      // If page out of range, optionally clamp or return error. We'll clamp.
      page = totalPages;
    }
    const skip = (page - 1) * limit;

    // Fetch filtered & paginated items after validation
    const items = await Food.find(query)
      .skip(skip)
      .limit(limit)
      .select("name price desc category img type inStock isDeleted");

    logger.info(`Fetched menu items (page: ${page}, limit: ${limit}, type: ${type}, category: ${category}, search: ${search})`);

    res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("Error fetching menu: " + error.message);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};

const getDeletedMenuItems = async (req, res) => {
  try {
    let { page = 1, limit = 20, search, type, category } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;
    if (!Number.isInteger(limit) || limit < 1) limit = 20;
    if (limit > 100) limit = 100;
    if (type && typeof type === 'string') {
      type = type.trim();
      if (type.length > 40) {
        return res.status(400).json(buildValidationError("Invalid type length", { type }));
      }
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const query = { isDeleted: true };

    // Filter by type if provided
    if (type && type !== "All") {
      const normalizedType = type.toLowerCase();
      if (!Object.values(FOOD_TYPES).includes(normalizedType)) {
        return res.status(400).json(buildValidationError("Invalid type value", { type }));
      }
      query.type = normalizedType;
    }

    // Filter by category if provided
    if (category && category !== "All") {
      const categoriesRaw = category.split(',').map(cat => cat.trim()).filter(cat => cat);
      if (categoriesRaw.length > 0) {
        const normalized = categoriesRaw.map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase());
        const invalid = normalized.filter(c => !Object.values(FOOD_CATEGORIES).includes(c));
        if (invalid.length) {
          return res.status(400).json(buildValidationError("Invalid category value(s)", { invalid }));
        }
        query.category = { $in: normalized };
      }
    }

    // Search by name if provided
    if (search && typeof search === 'string') {
      const safeSearch = escapeRegex(search.trim()).slice(0, 100);
      if (safeSearch.length > 0) {
        query.name = { $regex: safeSearch, $options: "i" };
      }
    }

    // Count first for validation
    const totalItems = await Food.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    if (page > totalPages) {
      page = totalPages;
    }
    const skip = (page - 1) * limit;

    // Fetch filtered & paginated items
    const items = await Food.find(query)
      .skip(skip)
      .limit(limit)
      .select("name price category img type inStock");

    logger.info(`Fetched deleted menu items (page: ${page}, limit: ${limit}, type: ${type}, category: ${category}, search: ${search})`);

    res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    logger.error("Error fetching deleted menu items: " + error.message);
    res.status(500).json({ message: "Error fetching deleted menu items" });
  }
};

// ADD new menu item (admin only)
const addMenuItem = async (req, res) => {
  try {
    let { name, desc, img, price, type, category } = req.body;
    if (!validateRequiredString(name, { min: 2, max: 80 })) {
      return res.status(400).json(buildValidationError("Invalid name", { name }));
    }
    if (!validateRequiredString(desc, { min: 5, max: 500 })) {
      return res.status(400).json(buildValidationError("Invalid description", { desc }));
    }
    if (!price || typeof price.org !== 'number' || price.org <= 0) {
      return res.status(400).json(buildValidationError("Invalid price", { price }));
    }
    if (!Array.isArray(category) || category.length === 0) {
      return res.status(400).json(buildValidationError("Category array required", { category }));
    }

    category = category.map((cat) => cat.trim());

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
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json(buildValidationError("Invalid menu item id", { id: req.params.id }));
    }
    const { name, desc, price, category, type, img, inStock } = req.body || {};
    const updateData = {};

    // Optional field validations (only validate if present)
    if (name !== undefined) {
      if (!validateRequiredString(name, { min: 2, max: 80 })) {
        return res.status(400).json(buildValidationError("Invalid name", { name }));
      }
      updateData.name = name.trim().toLowerCase();
    }
    if (desc !== undefined) {
      if (!validateRequiredString(desc, { min: 5, max: 500 })) {
        return res.status(400).json(buildValidationError("Invalid description", { desc }));
      }
      updateData.desc = desc.trim();
    }
    if (price !== undefined) {
      if (typeof price !== 'object' || typeof price.org !== 'number' || price.org <= 0) {
        return res.status(400).json(buildValidationError("Invalid price", { price }));
      }
      updateData.price = { ...price };
    }
    if (category !== undefined) {
      if (!Array.isArray(category) || category.length === 0) {
        return res.status(400).json(buildValidationError("Category array required", { category }));
      }
      updateData.category = category.map(c => c.trim());
    }
    if (type !== undefined) {
      if (!validateRequiredString(type, { min: 2, max: 40 })) {
        return res.status(400).json(buildValidationError("Invalid type", { type }));
      }
      updateData.type = type.trim();
    }
    if (img !== undefined) {
      if (!validateRequiredString(img, { min: 2, max: 300 })) {
        return res.status(400).json(buildValidationError("Invalid image path", { img }));
      }
      updateData.img = img.trim();
    }
    if (inStock !== undefined) {
      if (typeof inStock !== 'boolean') {
        return res.status(400).json(buildValidationError("inStock must be boolean", { inStock }));
      }
      updateData.inStock = inStock;
    }

    // Duplicate check if name or category being updated (or both)
    if (updateData.name || updateData.category) {
      const current = await Food.findById(req.params.id).select('name category');
      if (!current) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const prospectiveName = updateData.name || current.name;
      const prospectiveCategories = updateData.category || current.category;
      const duplicate = await Food.findOne({
        _id: { $ne: req.params.id },
        name: prospectiveName,
        category: { $all: prospectiveCategories, $size: prospectiveCategories.length }
      });
      if (duplicate) {
        return res.status(400).json({ message: "Duplicate food item with same name and categories already exists" });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(buildValidationError("No valid fields provided for update"));
    }

    const foodItem = await Food.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    foodItem.set(updateData);

    const updatedItem = await foodItem.save();
    logger.info(`Menu item updated: ${updatedItem.name} [${updatedItem.category.join(", ")}]`);
    res.status(200).json(updatedItem);
  } catch (error) {
    logger.error("Error updating menu item: " + error.message);
    res.status(400).json({ message: "Error updating menu item" });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json(buildValidationError("Invalid menu item id", { id: req.params.id }));
    }

    const updatedItem = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true } },
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

const restoreDeletedItem = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json(buildValidationError("Invalid menu item id", { id: req.params.id }));
    }

    const updatedItem = await Food.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: false } },
      { new: true }
    );
    if (!updatedItem) {
      logger.warn(`Menu item not found: ${req.params.id}`);
      return res.status(404).json({ message: "Menu item not found" });
    }
    logger.info(`Menu item restored: ${updatedItem.name} [${updatedItem.category.join(", ")}]`);
    res.status(200).json(updatedItem);
  } catch (error) {
    logger.error("Error restoring menu item: " + error.message);
    res.status(400).json({ message: "Error restoring menu item" });
  }
};

// DELETE menu item (admin only)
const permanentDeleteMenuItem = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json(buildValidationError("Invalid menu item id", { id: req.params.id }));
    }

    await Food.findByIdAndDelete(req.params.id);
    logger.info(`Menu item deleted: ${req.params.id}`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    logger.error("Error deleting menu item: " + error.message);
    res.status(400).json({ message: "Error deleting menu item" });
  }
};

export {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  permanentDeleteMenuItem,
  restoreDeletedItem,
  getDeletedMenuItems,
};
