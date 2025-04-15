const Order = require("../models/order");
const Food =require("../models/Food");
const placeOrder = async (req, res) => {
  const { items, total, paymentMethod } = req.body;

  try {
    console.log("placing",req.user.id);
    // const user = await User.findById(req.user.id); // Get the user from the request
    // console.log("placing kinda",user);
    // Create a new order
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      paymentMethod,
      status: "Placed",
    });

    // Save the order
    await newOrder.save();

    // // Add the new order to the user's orders
    // user.orders.push(newOrder._id);
    // await user.save(); // Save the user with the updated orders

    res.status(200).json(newOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    // console.log(req);
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product', // Populate the _id field within the items array
        select: 'name price img category' // Only select the fields you need
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
      return res.status(404).json({ message: "No previous orders found" });
    }
    // console.log(dishes);
    res.json(orders); // Return the populated orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const orders = await Order.find().populate("user", "name username").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};

module.exports = { placeOrder, getUserOrders,getAllOrders };
