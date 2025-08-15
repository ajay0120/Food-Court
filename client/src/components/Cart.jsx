import { ShoppingCart, Plus, Minus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { CartItemSkeleton } from "./skeletons";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    updateQuantity();
  }, []);

  const fetchCartItems = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    
    let startTime; // Declare in function scope for catch block access
    try {
      setIsLoading(true);
      
      // Start timer for minimum loading time
      startTime = Date.now();
      const minLoadingTime = 700; // 700ms minimum loading time
      
      if (token) {
        const res = await axios.get(`${baseURL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = res.data.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        
        // Calculate elapsed time and remaining delay needed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        // Wait for remaining time if API was too fast
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        setCartItems(items);
        calculateTotal(items);
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || {};
        const foodRes = await axios.get(`${baseURL}/api/food`);
        const items = foodRes.data
          .filter((item) => localCart[item._id])
          .map((item) => ({
            ...item,
            quantity: localCart[item._id],
          }));
        
        // Calculate elapsed time and remaining delay needed  
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        // Wait for remaining time if API was too fast
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        setCartItems(items);
        calculateTotal(items);
      }
    } catch (err) {
      // console.log("Error fetching cart:", err.message);
      // Respect minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 700 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    } finally {
      setIsLoading(false);
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
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const existingItem = cartItems.find((item) => item._id === id);
    if (!existingItem) return;
    const newQty = existingItem.quantity + delta;

    if (newQty < 1){
      if(token){
        try {
          setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === id);
            if (!existingItem) return prevItems;
    
            const newQty = existingItem.quantity + delta;
            return prevItems.filter(item => item._id !== id); 
          });
          // console.log(token);
          await axios.delete(
            `${baseURL}/api/cart/remove/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

        } catch (err) {
          console.error("Error updating cart:", err.message);
        }
      }
    }
    else{
      const updatedItems = cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      );
  
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
  
      if (token) {
        try {
          await axios.put(
            `${baseURL}/api/cart/update/${id}`,
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
    }
    
  };

  const handlePlaceOrder = async () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    
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

      await axios.post(`${baseURL}/api/order`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      setCartItems([]);
      setTotal(0);

      if (token) {
        await axios.delete(`${baseURL}/api/cart/clear`, {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />
      
      <div className="relative z-10 px-6 py-10">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-12 drop-shadow-2xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Cart
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 max-w-md mx-auto">
              <ShoppingCart size={64} className="mb-4 text-gray-400" />
              <p className="text-xl text-gray-300 mb-4">Your cart is empty</p>
              <p className="text-gray-400 mb-6">Add some delicious items to get started!</p>
              <motion.button
                onClick={() => navigate("/menu")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Menu
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className={`grid gap-8 mb-12 max-w-7xl mx-auto ${
                cartItems.length === 1 
                  ? 'grid-cols-1 justify-items-center' 
                  : cartItems.length === 2 
                  ? 'grid-cols-1 sm:grid-cols-2 justify-items-center sm:justify-items-stretch' 
                  : cartItems.length === 3 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center lg:justify-items-stretch' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {isLoading ? (
                // Show skeleton while loading
                Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={`cart-skeleton-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CartItemSkeleton />
                  </motion.div>
                ))
              ) : (
                cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300 flex items-center gap-2">
                      {/* Veg/Non-veg indicator */}
                      <div className={`w-4 h-4 border-2 flex items-center justify-center ${
                        item.type === 'veg' ? 'border-green-500' : 'border-red-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      {item.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-orange-400">₹{item.price.org}</span>
                      {item.price.mrp > item.price.org && (
                        <>
                          <span className="line-through text-sm text-gray-500 ml-2">₹{item.price.mrp}</span>
                          <span className="text-green-400 text-sm font-semibold ml-2">
                            ({Math.round(((item.price.mrp - item.price.org) / item.price.mrp) * 100)}% off)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="w-full">
                      <div className="flex items-center justify-center gap-3 bg-gray-700/50 rounded-2xl p-2.5">
                        <motion.button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded font-bold transition-all duration-300 cursor-pointer shadow-lg text-sm flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="text-lg font-bold text-white min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-8 h-8 rounded font-bold transition-all duration-300 cursor-pointer shadow-lg text-sm flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                      
                      {/* Item subtotal */}
                      <div className="mt-3 text-center">
                        <span className="text-sm text-gray-400">Subtotal: </span>
                        <span className="text-lg font-semibold text-orange-300">
                          ₹{(item.quantity * item.price.org).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
              )}
            </motion.div>

            {/* Total and Order Section */}
            <motion.div 
              className="text-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="text-orange-400">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() =>
                    navigate("/payment", {
                      state: {
                        cartItems,
                        total,
                      },
                    })
                  }
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>💳</span>
                    Place Order
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
