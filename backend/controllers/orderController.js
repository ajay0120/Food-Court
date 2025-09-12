const Order = require("../models/order");
const Food = require("../models/Food");
const logger = require('../logger.js');
const { validateObjectId, validatePositiveInt, buildValidationError } = require('../utils/validation');

logger.info("orderController loaded");

// Helper to extract & sanitize pagination params
const getPaginationParams = (req) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  // hard cap to avoid abusive large limits
  if (limit > 100) limit = 100;
  return { page, limit };
};

// Build pagination meta object
const buildMeta = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    totalItems: total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const placeOrder = async (req, res) => {
  const { items, total, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json(buildValidationError("Items required"));
  }
  for (const it of items) {
    if (!validateObjectId(it.product)) {
      return res.status(400).json(buildValidationError("Invalid product id in items", { product: it.product }));
    }
    if (!validatePositiveInt(it.quantity, { min: 1, max: 100 })) {
      return res.status(400).json(buildValidationError("Invalid quantity in items", { quantity: it.quantity }));
    }
  }
  if (typeof paymentMethod !== 'string') {
    return res.status(400).json(buildValidationError("Payment method required"));
  }
  if (typeof total !== 'number' || total < 0) {
    return res.status(400).json(buildValidationError("Invalid total", { total }));
  }

  try {
    logger.info(`Placing order for user ${req.user.id}`);
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      paymentMethod,
      status: "Placed",
    });
    // Batch fetch & validate items (avoid N+1 queries)
    const productIds = [...new Set(items.map(i => i.product))];
    const foods = await Food.find({ _id: { $in: productIds } })
      .select('price.org inStock isDeleted');
    const foodMap = new Map(foods.map(f => [f._id.toString(), f]));

    // Detect missing products
    const missing = productIds.filter(id => !foodMap.has(id));
    if (missing.length) {
      logger.warn(`Order contains invalid product ids: ${missing.join(', ')}`);
      return res.status(400).json(buildValidationError("One or more products are invalid", { missing }));
    }

    // Validate stock & deletion status, calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const f = foodMap.get(item.product);
      if (f.isDeleted) {
        logger.warn(`Attempt to order deleted product ${item.product}`);
        return res.status(400).json(buildValidationError("Product no longer available", { product: item.product }));
      }
      if (!f.inStock) {
        logger.warn(`Attempt to order out-of-stock product ${item.product}`);
        return res.status(400).json(buildValidationError("Product out of stock", { product: item.product }));
      }
      if (typeof f.price?.org !== 'number' || f.price.org <= 0) {
        logger.warn(`Invalid price data for product ${item.product}`);
        return res.status(400).json(buildValidationError("Invalid product price", { product: item.product }));
      }
      calculatedTotal += f.price.org * item.quantity;
    }
    logger.debug && logger.debug(`Calculated total for order: ${calculatedTotal}`);
    if (!Number.isFinite(calculatedTotal) || calculatedTotal !== total) {
      logger.warn(`Total price mismatch: calculated ${calculatedTotal}, provided ${total}`);
      return res.status(400).json({ message: "Total price mismatch" });
    }
    // Save the order
    await newOrder.save();
    logger.info(`Order placed successfully for user ${req.user.id} with order ID ${newOrder._id}`);
    res.status(200).json(newOrder);
  } catch (error) {
    logger.error("Error placing order: " + error.message);
    res.status(500).json({ message: "Error placing order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    logger.info(`Fetching orders for user ${req.user.id}`);
    const { page, limit } = getPaginationParams(req);
    const filter = { user: req.user.id };

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate({ path: 'items.product', select: 'name price img category' })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);

    if (orders.length === 0) {
      logger.warn(`No orders found for user ${req.user.id} (page ${page})`);
    }

    return res.status(200).json({
      orders,
      pagination: buildMeta({ total, page, limit }),
    });
  } catch (error) {
    logger.error("Error fetching orders: " + error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!validateObjectId(orderId)) {
      return res.status(400).json(buildValidationError("Invalid order id", { orderId }));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      logger.warn(`Order with ID ${orderId} does not exist`);
      return res.status(404).json({ message: "Order doesn't exist" });
    }

    // Checking if the order belongs to the logged-in user
    // if (order.user.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized to cancel this order" });
    // }

    if (order.status !== "Placed") {
      logger.warn(`Order with ID ${orderId} cannot be cancelled, current status: ${order.status}`);
      return res.status(400).json({ message: "Only placed orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    logger.info(`Order ${orderId} cancelled by user ${req.user.id}`);
    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    logger.error(`Error cancelling order for user ${req.user.id}: ${err.message}`);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    logger.info(`Fetching all orders by user ${req.user.id}`);
    if (req.user.role !== "admin") {
      logger.warn(`Access denied for user ${req.user.id} to fetch all orders`);
      return res.status(403).json({ message: "Access denied" });
    }
    const { page, limit } = getPaginationParams(req);
    const filter = {};
    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate({ path: 'user', select: 'name username' })
        .populate({ path: 'items.product', select: 'name price img category' })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);
    logger.info(`Fetched ${orders.length} orders (page ${page})`);
    return res.status(200).json({ orders, pagination: buildMeta({ total, page, limit }) });
  } catch (err) {
    logger.error("Error fetching all orders: " + err.message);
    res.status(500).json({ message: "Error fetching all orders" });
  }
};

const getCurrentOrders = async (req, res) => {
  try {
    logger.info(`Fetching current orders for user ${req.user.id}`);
    if (req.user.role !== "admin") {
      logger.warn(`Access denied for user ${req.user.id} to fetch current orders`);
      return res.status(403).json({ message: "Access denied" });
    }
    const { page, limit } = getPaginationParams(req);
    const filter = { status: 'Placed' };
    const [total, currentOrders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate({ path: 'user', select: 'name username' })
        .populate({ path: 'items.product', select: 'name price img category' })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);
    logger.info(`Fetched ${currentOrders.length} current orders (page ${page})`);
    return res.status(200).json({ orders: currentOrders, pagination: buildMeta({ total, page, limit }) });
  } catch (err) {
    logger.error("Error fetching current orders: " + err.message);
    res.status(500).json({ message: "Error fetching current orders" });
  }
}

const getPastOrders = async (req, res) => {
  try {
    logger.info(`Fetching past orders for user ${req.user.id}`);
    if (req.user.role != "admin") {
      logger.warn(`Access denied for user ${req.user.id} to fetch past orders`);
      return res.status(403).json({ message: "Access denied" });
    }
    const { page, limit } = getPaginationParams(req);
    const filter = { status: 'Delivered' };
    const [total, pastOrders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate({ path: 'user', select: 'name username' })
        .populate({ path: 'items.product', select: 'name price img category' })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);
    logger.info(`Fetched ${pastOrders.length} past orders (page ${page})`);
    return res.status(200).json({ orders: pastOrders, pagination: buildMeta({ total, page, limit }) });
  } catch (err) {
    logger.error("Error fetching past orders: " + err.message);
    res.status(500).json({ message: "Error fetching all orders" });
  }
}

const markAsDelivered = async (req, res) => {
  try {
    logger.info(`Marking order as delivered for user ${req.user.id}`);
    if (req.user.role != "admin") {
      logger.warn(`Access denied for user ${req.user.id} to mark order as delivered`);
      return res.status(403).json({ message: "Access denied" });
    }
    const { orderId } = req.body;
    if (!validateObjectId(orderId)) {
      return res.status(400).json(buildValidationError("Invalid order id", { orderId }));
    }
    const orderExist = await Order.find({ orderId });
    if (!orderExist) {
      logger.warn(`Order with ID ${orderId} does not exist`);
      return res.status(400).json({ message: "Order doesn't exist" });
    }
    await Order.updateOne(
      { _id: orderId },
      { $set: { status: "Delivered" } }
    );
    logger.info(`Order ${orderId} marked as delivered by user ${req.user.id}`);
    return res.status(200).json({ message: "Order marked as delivered" });
  } catch {
    logger.error("Error in marking order as delivered: " + err.message);
    res.status(500).json({ message: "Error in marking" });
  }

}

const getCancelledOrders = async (req, res) => {
  try {
    logger.info(`Fetching cancelled orders for user ${req.user.id}`);
    if (req.user.role !== "admin") {
      logger.warn(`Access denied for user ${req.user.id} to fetch cancelled orders`);
      return res.status(403).json({ message: "Access denied" });
    }
    const { page, limit } = getPaginationParams(req);
    const filter = { status: 'Cancelled' };
    const [total, cancelledOrders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .populate({ path: 'user', select: 'name username' })
        .populate({ path: 'items.product', select: 'name price img category' })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);
    logger.info(`Fetched ${cancelledOrders.length} cancelled orders (page ${page})`);
    return res.status(200).json({ orders: cancelledOrders, pagination: buildMeta({ total, page, limit }) });

  } catch (err) {
    logger.error("Error getting cancelled orders: " + err.message);
    return res.status(500).json({ message: "Error getting cancelled orders" });
  }
}

module.exports = { placeOrder, getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders, getCancelledOrders, markAsDelivered };
