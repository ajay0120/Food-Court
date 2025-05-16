import { Toaster } from 'react-hot-toast';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { fetchCartData, updateCartItem } from "../services/cartService";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // You can change limit as per your design
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState("All");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  // Fetch menu and cart on mount
  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, [page, search, category, type]);

  const fetchMenu = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: search.trim(),
        type: type === "All" ? "" : type,
        category: category === "All" ? "" : category,
      });
      // console.log("the type is",type);
      // console.log("the category is",category);
      const res = await axios.get(`http://localhost:5000/api/menu?${queryParams}`);
      // console.log(res.data.pagination);
      console.log(res.data.items);
      setMenu(res.data.items);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.log("Error fetching menu in frontend:", err.message);
    }
  };

  const fetchCart = async () => {
    if (!token) {
      console.log("User is not logged in.");
      return;
    }
    try {
      const cartData = await fetchCartData(token);
      setCart(cartData);
    } catch (err) {
      console.log("Error fetching cart data:", err.message);
    }
  };

  const updateCart = async (productId, newQty) => {
    const updatedCart = { ...cart, [productId]: newQty };
    if (newQty === 0) delete updatedCart[productId];
    setCart(updatedCart);

    await updateCartItem(token, productId, newQty, cart);
  };

  const handleAddToCart = (id) => {
    updateCart(id, (cart[id] || 0) + 1);
  };

  const handleQuantityChange = (id, delta) => {
    const newQty = (cart[id] || 0) + delta;
    updateCart(id, newQty < 0 ? 0 : newQty);
  };

  const categorySet = new Set();

  menu.forEach((item) => {
    const categories = Array.isArray(item.category)
      ? item.category
      : [item.category]; // wrap string in array

    categories.forEach((cat) => {
      if (typeof cat === "string" && cat.trim()) {
        categorySet.add(cat.trim());
      }
    });
  });

  const uniqueCategories = ["All", ...Array.from(categorySet)];


  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <h1 className="text-4xl font-bold text-orange-500 text-center mb-10">
        Our Delicious Menu
      </h1>

      {userRole === "admin" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/adminMenu")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition cursor-pointer"
          >
            Edit Menu
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center items-center gap-5 mb-8">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-orange-500 w-full md:w-1/3"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-orange-500 w-full md:w-1/4"
        >
          <option value="">All</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-orange-500 w-full md:w-1/4"
        >
          {uniqueCategories.map((cat, index) => (
            <option key={`${cat}-${index}`}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {menu.map((item) => {
          const isOutOfStock = item.inStock === false;

          return (
            <div
              key={item._id}
              className={`bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <img
                src={item.img}
                alt={item.name}
                className={`w-32 h-32 object-cover rounded mb-3 `}
              />

              <h3 className="text-xl font-bold text-orange-400">{item.name}</h3>
              <p className="text-gray-400 text-sm text-center mt-1">{item.desc}</p>
              <p className="text-white mt-2">
                ₹{item.price.org}{" "}
                {item.price.mrp > item.price.org && (
                  <span className="line-through text-gray-500 ml-2">
                    ₹{item.price.mrp}
                  </span>
                )}
              </p>

              <div className="mt-4">
                {!isOutOfStock ? (
                  cart[item._id] ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="bg-orange-500 text-white px-2 py-1 rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span>{cart[item._id]}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="bg-orange-500 text-white px-2 py-1 rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="bg-orange-500 text-white px-4 py-2 mt-3 rounded hover:bg-orange-600 cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  )
                ) : (
                  <div className="text-red-500 font-semibold mt-3">Out of Stock</div>
                )}
              </div>
            </div>
          );
        })}

      </div>
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-white px-4 py-2 ">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Menu;
