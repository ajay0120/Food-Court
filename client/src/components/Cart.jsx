import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    if (token) {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        setCartItems(items);
        calculateTotal(items);
      } catch (err) {
        console.log("Error fetching cart:", err.message);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {};
      const foodRes = await axios.get("http://localhost:5000/api/food");
      const items = foodRes.data
        .filter((item) => localCart[item._id])
        .map((item) => ({
          ...item,
          quantity: localCart[item._id],
        }));
      setCartItems(items);
      calculateTotal(items);
    }
  };

  const calculateTotal = (items) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.quantity * item.price.org,
      0
    );
    setTotal(totalPrice);
  };

  const updateQuantity = async (id, delta) => {
    const existingItem = cartItems.find((item) => item._id === id);
    const newQty = existingItem.quantity + delta;

    if (newQty < 1) return;

    const updatedItems = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQty } : item
    );

    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    if (token) {
      try {
        await axios.put(
          `http://localhost:5000/api/cart/update/${id}`,
          { quantity: newQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error updating cart:", err.message);
      }
    } else {
      const localCart = {};
      updatedItems.forEach((item) => {
        localCart[item._id] = item.quantity;
      });
      localStorage.setItem("cart", JSON.stringify(localCart));
    }
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Login to place an order.");
      return navigate("/login");
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };

      await axios.post("http://localhost:5000/api/order", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      setCartItems([]);
      setTotal(0);

      if (token) {
        await axios.delete("http://localhost:5000/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        localStorage.removeItem("cart");
      }
    } catch (err) {
      console.error("Order failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <Navbar />
      <h1 className="text-4xl font-bold text-orange-500 text-center mb-10">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-10">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded mb-3"
                />
                <h3 className="text-xl font-bold text-orange-400">
                  {item.name}
                </h3>
                <p className="text-white mt-2">₹{item.price.org}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="bg-orange-500 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="bg-orange-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Total: ₹{total.toFixed(2)}
            </h2>
            <button
              onClick={()=>
                navigate("/payment",{
                  state:
                  {
                    cartItems,
                    total,
                  },
                })
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
