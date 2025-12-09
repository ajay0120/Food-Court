import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PAYMENT_METHODS } from "../../../common/orderEnums";

function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderItems, setOrderItems] = useState([]); // New state
  const [isPlacing, setIsPlacing] = useState(false); // disable UI while placing
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
    if (isPlacing) return; // guard: don't allow double submits
    try {
      setIsPlacing(true); // show spinner/message until backend answers

      const token = localStorage.getItem("token");
      const MIN_WAIT_MS = 3000;
      const start = Date.now();

      // send order to backend
      const res = await axios.post(`/orders`, {
        items: orderItems,
        total: totalAmount,
        paymentMethod,
      });

      // ensure spinner runs at least MIN_WAIT_MS even if backend is quick
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_WAIT_MS - elapsed);
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }

      toast.success("Order placed successfully!");

      // Clear cart in backend
      await axios.delete(`/cart/clear`);

      // Clear frontend state
      setCartItems([]);
      setTotalAmount(0);
      setIsPlacing(false);
      navigate("/profile");
    } catch (err) {
      setIsPlacing(false); // re-enable button so user can retry
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
          onClick={() => placeOrder(PAYMENT_METHODS.CASH)}
          disabled={isPlacing}
          className={`bg-orange-500 px-4 py-2 rounded mr-4 transition ${isPlacing ? "opacity-70 cursor-not-allowed" : "hover:bg-orange-600 cursor-pointer"
            }`}
          aria-disabled={isPlacing}
        >
          {isPlacing ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="4"></circle>
                <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"></path>
              </svg>
              Placing order...
            </span>
          ) : (
            "Cash on Delivery"
          )}
        </button>

        {/* Small floating preview shown while placing — informs user not to go back */}
        {isPlacing && (
          <div className="fixed left-1/2 transform -translate-x-1/2 bottom-24 z-50">
            <div className="bg-gray-900/90 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-gray-700">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="4"></circle>
                <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3" strokeLinecap="round"></path>
              </svg>
              <div className="text-left text-sm">
                <div className="font-semibold">Placing order</div>
                <div className="text-xs text-gray-300">Please don't go back or refresh — processing with server.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
