import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PAYMENT_METHODS } from "../../../common/orderEnums"; 

function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderItems, setOrderItems] = useState([]); // New state
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/cart`);

      const itemsForDisplay = res.data.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));

      const itemsForOrder = res.data.map((item) => ({
        product: item.product._id, // Just the ObjectId
        quantity: item.quantity,
      }));

      setCartItems(itemsForDisplay);
      setOrderItems(itemsForOrder); // Save for order request
      calculateTotal(itemsForDisplay);
    } catch (err) {
      toast.error("Server error while fetching cart");
      console.error(err.message);
    }
  };

  const calculateTotal = (items) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * item.price.org,
      0
    );
    setTotalAmount(totalPrice);
  };

  const placeOrder = async (paymentMethod) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("paymentMethod:", paymentMethod);
      const res = await axios.post(
        `/orders`,
        {
          items: orderItems, // Use correctly formatted items
          total: totalAmount,
          paymentMethod,
        }
      );

      toast.success("Order placed successfully!");

      // Clear cart in backend
      await axios.delete(`/cart/clear`);

      // Clear frontend state
      setCartItems([]);
      setTotalAmount(0);
      navigate("/profile");
    } catch (err) {
      toast.error("Error placing order");
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Payment</h2>

      <div className="bg-gray-800 p-5 rounded-lg mb-5">
        <h3 className="text-xl mb-3 font-semibold">Order Summary</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex justify-between my-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price.org * item.quantity}</span>
            </div>
          ))
        ) : (
          <div>No items in cart</div>
        )}
        <div className="border-t border-gray-600 mt-4 pt-4 text-lg font-bold">
          Total: ₹{totalAmount}
        </div>
      </div>

      <div className="bg-gray-800 p-5 rounded-lg">
        <h3 className="text-xl mb-3 font-semibold">Select Payment Method</h3>
        <button
          onClick={() => placeOrder(PAYMENT_METHODS[0])} // Using PAYMENT_METHODS[0] is cash
          className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 mr-4 cursor-pointer"
        >
          Cash on Delivery
        </button>
      </div>
    </div>
  );
}

export default Payment;
