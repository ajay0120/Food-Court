import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);

  useEffect(() => {
    filterMenu();
  }, [search, category, menu]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food");
      setMenu(res.data);
    } catch (err) {
      console.log("Error fetching menu:", err.message);
    }
  };

  const fetchCart = async () => {
    if (token) {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = {};
        res.data.cart.forEach(item => {
          cartData[item.product._id] = item.quantity;
        });
        setCart(cartData);
      } catch (err) {
        console.log("Error fetching cart:", err.message);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(localCart);
    }
  };

  const filterMenu = () => {
    let result = menu;
    if (category !== "All") {
      result = result.filter(item => item.category.includes(category));
    }
    if (search.trim()) {
      result = result.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredMenu(result);
  };

  const updateCart = async (productId, newQty) => {
    let updatedCart = { ...cart, [productId]: newQty };
    if (newQty === 0) delete updatedCart[productId];

    setCart(updatedCart);

    if (token) {
      try {
        await axios.put(
          "http://localhost:5000/api/cart/update",
          { productId, quantity: newQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.log("Error updating cart:", err.message);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleAddToCart = (id) => {
    updateCart(id, (cart[id] || 0) + 1);
  };

  const handleQuantityChange = (id, delta) => {
    const newQty = (cart[id] || 0) + delta;
    updateCart(id, newQty < 0 ? 0 : newQty);
  };

  const uniqueCategories = ["All", ...new Set(menu.flatMap(item => item.category))];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <Navbar/>
      <h1 className="text-4xl font-bold text-orange-500 text-center mb-10">Our Delicious Menu</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-8">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-orange-500 w-full md:w-1/3"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-orange-500 w-full md:w-1/4"
        >
          {uniqueCategories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredMenu.map(item => (
          <div
            key={item._id}
            className="bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition"
          >
            <img src={item.img} alt={item.name} className="w-32 h-32 object-cover rounded mb-3" />
            <h3 className="text-xl font-bold text-orange-400">{item.name}</h3>
            <p className="text-gray-400 text-sm text-center mt-1">{item.desc}</p>
            <p className="text-white mt-2">
              ₹{item.price.org}{" "}
              {item.price.mrp > item.price.org && (
                <span className="line-through text-gray-500 ml-2">₹{item.price.mrp}</span>
              )}
            </p>

            {/* Cart Buttons */}
            <div className="mt-4">
              {cart[item._id] ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="bg-orange-500 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{cart[item._id]}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="bg-orange-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="bg-orange-500 text-white px-4 py-2 mt-3 rounded hover:bg-orange-600"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
