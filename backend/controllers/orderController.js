const Order = require("../models/order");
const Food = require("../models/Food");
const logger = require('../logger.js');

logger.info("orderController loaded");

const placeOrder = async (req, res) => {
  const { items, total, paymentMethod } = req.body;

  try {
    logger.info(`Placing order for user ${req.user.id}`);
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      paymentMethod,
      status: "Placed",
    });

    // Validate items
    for (const item of items) {
      const foodItem = await Food.findById(item.product);
      if (!foodItem) {
        logger.warn(`Invalid food item in order: ${item.product}`);
        return res.status(400).json({ message: "Invalid food item" });
      }
    }

    // Calculate total price
    let calculatedTotal = 0;
    for (const item of items) {
      const foodItem = await Food.findById(item.product);
      if (foodItem) {
        calculatedTotal += foodItem.price.org * item.quantity;
      }
    }
    console.log("calculatedTotal", calculatedTotal);
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
    // console.log(req);
    logger.info(`Fetching orders for user ${req.user.id}`);

    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price img category'
      })
      .exec();

    // console.log(orders); // Log the populated orders for debugging
    // orders.forEach(order => {
    //   order.items.forEach(item => {
    //     console.log(item._id.name); // Should not be undefined
    //     console.log("item",item._id);
    //   });
    // });


    // for (const order of orders) {
    //   for (const item of order.items) {
    //     const food = await Food.findById(item._id).select('name price img category');
    //     console.log(food); // Check if this returns the expected fields
    //   }
    // }
    // console.log(orders[0].items[0]._id.name);
    if (orders.length === 0) {
      logger.warn(`No previous orders found for user ${req.user.id}`);
      return res.status(404).json({ message: "No previous orders found" });
    }
    // console.log(dishes);
    res.json(orders); // Return the populated orders
  } catch (error) {
    logger.error("Error fetching orders: " + error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      logger.warn("Order ID is required for cancellation");
      return res.status(400).json({ message: "Order ID is required" });
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
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name username',
      })
      .populate({
        path: 'items.product',
        select: 'name price img category',
      })
      .sort({ createdAt: -1 });
    logger.info(`Fetched ${orders.length} orders`);
    res.json(orders);
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
    const currentOrders = await Order.find({ status: 'Placed' })
      .populate({ path: 'user', select: 'name username' })
      .populate({ path: 'items.product', select: 'name price img category' })
      .sort({ createdAt: -1 });
    logger.info(`Fetched ${currentOrders.length} current orders`);
    res.json(currentOrders);
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
    const pastOrders = await Order.find({ status: 'Delivered' })
      .populate({ path: 'user', select: 'name username' })
      .populate({ path: 'items.product', select: 'name price img category' })
      .sort({ createdAt: -1 });
    logger.info(`Fetched ${pastOrders.length} past orders`);
    // console.log(pastOrders);
    res.json(pastOrders);
  } catch {
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
    if (!orderId) {
      logger.warn("Mark as delivered attempt without order ID");
      return res.status(400).json({ message: "Order ID is required" });
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
    const cancelledOrders = await Order.find({ status: 'Cancelled' })
      .populate({ path: 'user', select: 'name username' })
      .populate({ path: 'items.product', select: 'name price img category' })
      .sort({ createdAt: -1 });
    logger.info(`Fetched ${cancelledOrders.length} cancelled orders`);
    res.json(cancelledOrders);

  } catch (err) {
    logger.error("Error getting cancelled orders: " + err.message);
    return res.status(500).json({ message: "Error getting cancelled orders" });
  }
}

module.exports = { placeOrder, getUserOrders, cancelOrder, getAllOrders, getCurrentOrders, getPastOrders, getCancelledOrders, markAsDelivered };
