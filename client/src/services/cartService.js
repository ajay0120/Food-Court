import axios from "../api/axios";
import toast from "react-hot-toast";

const getBaseURL = () => {
  return `/cart`;
};

const BASE_URL = getBaseURL();

export const fetchCartData = async (token) => {
  if (token) {
    try {
      const res = await axios.get(BASE_URL);
      const cartData = {};
      res.data.forEach(item => {
        cartData[item.product._id] = item.quantity;
      });
      return cartData;
    } catch (err) {
      console.error("Error fetching cart:", err.message);
      toast.error("Failed to load cart!");
      return {};
    }
  } else {
    const localCart = JSON.parse(localStorage.getItem("cart")) || {};
    return localCart;
  }
};

export const updateCartItem = async (token, productId, newQty, currentCart = {}) => {
  if (token) {
    try {
      if (newQty === 0) {
        await axios.delete(`${BASE_URL}/remove/${productId}`);
        toast("Item removed from cart", { icon: "🗑️" });
      } else if (!currentCart[productId]) {
        await axios.post(
          `${BASE_URL}/add`,
          { productId }
        );
        toast.success("Item added to cart");
      } else {
        await axios.put(
          `${BASE_URL}/update/${productId}`,
          { quantity: newQty }
        );
        toast.success("Cart updated");
      }
    } catch (err) {
      console.error("Cart error:", err.message);
      toast.error("Cart update failed");
    }
  } else {
    const localCart = JSON.parse(localStorage.getItem("cart")) || {};
    if (newQty === 0) {
      delete localCart[productId];
      toast("Item removed from cart", { icon: "🗑️" });
    } else {
      localCart[productId] = newQty;
      if (!currentCart[productId]) {
        toast.success("Item added to cart");
      } else {
        toast.success("Cart updated");
      }
    }
    localStorage.setItem("cart", JSON.stringify(localCart));
    return localCart;
  }
};
