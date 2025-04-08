import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId) => {
    if (token) {
      await axios.post(
        "/api/cart/add",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } else {
      // Fallback: localStorage for guests
      let local = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = local.findIndex((item) => item.product === productId);
      if (idx !== -1) local[idx].quantity++;
      else local.push({ product: productId, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(local));
      setCart(local);
    }
  };

  const updateCart = async (itemId, quantity) => {
    if (token) {
      await axios.put(
        `/api/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    }
  };

  const removeFromCart = async (itemId) => {
    if (token) {
      await axios.delete(`/api/cart/remove/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
