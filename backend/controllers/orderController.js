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
      return res.status(404).json({ message: "No previous orders found" });
    }
    // console.log(dishes);
    res.json(orders); // Return the populated orders
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order doesn't exist" });
    }

    // Checking if the order belongs to the logged-in user
    // if (order.user.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized to cancel this order" });
    // }

    if (order.status !== "Placed") {
      return res.status(400).json({ message: "Only placed orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling order:", err);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};


const getAllOrders = async (req, res) => {
  try {
    console.log("Hi How are you");
    if (req.user.role !== "admin") {
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
    console.log(orders);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};

const getCurrentOrders= async(req,res)=>{
  try{
    if(req.user.role !=="admin"){
      return res.status(403).json({ message: "Access denied" });
    }
    const currentOrders = await Order.find({ status:  'Placed'  })
    .populate({ path: 'user', select: 'name username' })
    .populate({ path: 'items.product', select: 'name price img category' })
    .sort({ createdAt: -1 });
    console.log(currentOrders);
    res.json(currentOrders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
}

const getPastOrders = async(req,res)=> {
  try{
    if(req.user.role!="admin"){
      return res.status(403).json({message: "Access denied"});
    }
    const pastOrders= await Order.find({ status: 'Delivered' })
    .populate({ path: 'user', select: 'name username' })
    .populate({ path: 'items.product', select: 'name price img category' })
    .sort({ createdAt: -1 });
    // console.log(pastOrders);
    res.json(pastOrders);
  } catch{
    res.status(500).json({message:"Error fetching all orders"});
  }
}

const markAsDelivered = async(req,res)=>{
  try{
    if(req.user.role!="admin"){
      return res.status(403).json({message:"Access denied"});
    }
    const {orderId}=req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });
    const orderExist=await Order.find({orderId});
    if(!orderExist) return res.status(400).json({ message: "Order dosen't exist" });
    await Order.updateOne(
      {_id:orderId},
      {$set:{status : "Delivered"}}
    );
    return res.status(200).json({ message: "Order marked as delivered" });
  } catch{
    res.status(500).json({message:"Error in marking"});
  }
  

}

const getCancelledOrders = async (req,res) => {
  try{
    if(req.user.role !== "admin"){
      return res.status(403).json({message: "Access denied"});
    }
    const cancelledOrders= await Order.find({ status: 'Cancelled' })
    .populate({ path: 'user', select: 'name username' })
    .populate({ path: 'items.product', select: 'name price img category' })
    .sort({ createdAt: -1 });
    res.json(cancelledOrders);

  } catch{
    return res.status(500).json({message: "Error getting cancelled orders"});
  }
}

module.exports = { placeOrder, getUserOrders,cancelOrder, getAllOrders, getCurrentOrders, getPastOrders,getCancelledOrders, markAsDelivered};
