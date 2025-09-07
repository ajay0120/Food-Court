import { Toaster } from 'react-hot-toast';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, Utensils, ChevronDown } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import { fetchCartData, updateCartItem } from "../services/cartService";
import { MenuItemSkeleton } from "./skeletons";
import { FOOD_TYPES, FOOD_CATEGORIES } from "../../../common/foodEnums";

// Custom styles for dropdown options
const dropdownStyles = `
  .custom-select option {
    background-color: #1f2937 !important;
    color: #ffffff !important;
    padding: 8px 12px !important;
    border: none !important;
    font-size: 16px !important;
  }
  
  .custom-select option:hover {
    background-color: #374151 !important;
  }
  
  .custom-select option:checked {
    background-color: #f97316 !important;
    color: #ffffff !important;
  }
  
  .custom-select option[value=""] {
    color: #9ca3af !important;
    font-style: italic;
  }
  
  .custom-select option[value="veg"] {
    color: #10b981 !important;
  }
  
  .custom-select option[value="non-veg"] {
    color: #ef4444 !important;
  }
`;

function Menu() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cart, setCart] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // You can change limit as per your design
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  // Applied filter states (what's actually being used for API calls)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedType, setAppliedType] = useState("");
  
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  // Fetch menu and cart on mount
  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, [page, appliedSearch, appliedCategories, appliedType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-dropdown')) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyFilters = () => {
    setAppliedSearch(search);
    setAppliedCategories(selectedCategories);
    setAppliedType(type);
    setPage(1); // Reset to first page when applying new filters
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setType("");
    setAppliedSearch("");
    setAppliedCategories([]);
    setAppliedType("");
    setPage(1);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category];
      return newCategories;
    });
  };

  const fetchMenu = async () => {
    let startTime; // Declare in function scope for catch block access
    try {
      setIsLoading(true);
      
      // Start both the API call and minimum loading timer
      startTime = Date.now();
      const minLoadingTime = 800; // 800ms minimum loading time
      
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: appliedSearch.trim(),
        type: appliedType || "",
        category: appliedCategories.join(',') || "",
      });
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.get(`${baseURL}/api/menu?${queryParams}`);
      
      // Calculate elapsed time and remaining delay needed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for remaining time if API was too fast
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setMenu(res.data.items);
    } catch (err) {
      // Even on error, respect minimum loading time for consistent UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!token) {
      setIsCartLoading(false);
      return;
    }
    
    let startTime; // Declare in function scope for catch block access
    try {
      setIsCartLoading(true);
      
      // Start timer and API call
      startTime = Date.now();
      const minLoadingTime = 600; // 600ms minimum for cart (shorter than menu)
      
      const cartData = await fetchCartData(token);
      
      // Calculate elapsed time and remaining delay needed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for remaining time if API was too fast
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setCart(cartData);
    } catch (err) {
      // Respect minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 600 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    } finally {
      setIsCartLoading(false);
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Custom dropdown styles */}
      <style dangerouslySetInnerHTML={{ __html: dropdownStyles }} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <div className="relative z-10 px-6 py-10">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-12 drop-shadow-2xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Delicious Menu
        </motion.h1>

        {userRole === "admin" && (
          <motion.div 
            className="flex justify-end mb-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={() => navigate("/adminMenu")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🔧 Edit Menu
            </motion.button>
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <motion.div
          className="flex flex-col lg:flex-row justify-center items-center gap-6 mb-12 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative w-full lg:w-2/5">
            <input
              type="text"
              placeholder="Search delicious food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-lg placeholder-gray-400"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <div className="relative w-full lg:w-1/5">
            <motion.select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="custom-select w-full px-6 py-4 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 cursor-pointer appearance-none"
              style={{
                backgroundImage: 'none'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="" className="bg-gray-800 text-gray-400 py-2">All Types</option>
              {FOOD_TYPES.map((foodType) => (
                <option key={foodType} value={foodType} className="bg-gray-800 text-white py-2 hover:bg-gray-700 capitalize">
                  {foodType === 'veg' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
                </option>
              ))}
            </motion.select>
            
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          {/* Categories Multi-select Dropdown */}
          <div className="relative w-full lg:w-1/5 category-dropdown">
            <motion.div
              className="w-full px-6 py-4 rounded-2xl bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600 focus:border-orange-500 transition-all duration-300 cursor-pointer"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <span className={selectedCategories.length === 0 ? "text-gray-400" : "text-white"}>
                  {selectedCategories.length === 0 
                    ? "Categories" 
                    : selectedCategories.length === 1 
                    ? selectedCategories[0]
                    : `${selectedCategories.length} selected`
                  }
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    categoryDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </motion.div>
            
            {/* Dropdown Content */}
            {categoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
              >
                <div className="p-2">
                  {FOOD_CATEGORIES.map((category) => (
                    <motion.label
                      key={category}
                      className="flex items-center p-3 hover:bg-gray-700/50 rounded-xl cursor-pointer transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 mr-3"
                      />
                      <span className="text-white capitalize flex items-center">
                        <Utensils size={16} className="mr-2 text-gray-400" />
                        {category}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Filter Action Buttons */}
          <div className="flex gap-3 w-full lg:w-auto">
            <motion.button
              onClick={applyFilters}
              className="flex-1 lg:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Apply
            </motion.button>
            
            <motion.button
              onClick={clearFilters}
              className="flex-1 lg:flex-none bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </motion.button>
          </div>
        </motion.div>

        {/* Filters applied */}
        {(appliedSearch || appliedCategories.length > 0 || appliedType) && (
          <motion.div 
            className="max-w-6xl mx-auto mb-6 p-4 bg-gray-800/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-gray-400">
              <strong>Applied Filters:</strong> 
              {appliedSearch && ` Search: "${appliedSearch}"`}
              {appliedType && ` | Type: ${appliedType}`}
              {appliedCategories.length > 0 && ` | Categories: ${appliedCategories.join(', ')}`}
            </p>
          </motion.div>
        )}

        {/* Menu Grid */}
        <motion.div 
          className={`grid gap-8 max-w-7xl mx-auto ${
            menu.length === 1 
              ? 'grid-cols-1 justify-items-center' 
              : menu.length === 2 
              ? 'grid-cols-1 sm:grid-cols-2 justify-items-center sm:justify-items-stretch' 
              : menu.length === 3 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center lg:justify-items-stretch' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {isLoading ? (
            // Show skeleton while loading
            Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MenuItemSkeleton />
              </motion.div>
            ))
          ) : (
            menu.map((item, index) => {
            const isOutOfStock = item.inStock === false;

            return (
              <motion.div
                key={item._id}
                className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden flex flex-col ${
                  isOutOfStock ? 'opacity-60' : 'hover:scale-105'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={!isOutOfStock ? { y: -8 } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Stock indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl shadow-lg"
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center">
                        <span className="text-red-400 font-bold text-sm">OUT OF STOCK</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300 flex items-center gap-2">
                    {/* Traditional Veg/Non-veg indicator */}
                    <div className={`w-4 h-4 border-2 flex items-center justify-center ${
                      item.type === 'veg' ? 'border-green-500' : 'border-red-500'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed px-2 flex-grow overflow-hidden">
                    <span className="line-clamp-3">
                      {item.desc}
                    </span>
                  </p>
                  
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

                  {/* Categories Display */}
                  <div className="mb-3 flex flex-wrap gap-1 justify-center">
                    {item.category && item.category.length > 0 && item.category.map((cat, i) => (
                      <span key={i} className="bg-gray-700/50 text-xs px-2 py-1 rounded-full text-gray-300 border border-gray-600">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Cart Controls - Fixed at bottom */}
                  <div className="w-full mt-auto">
                    {!isOutOfStock ? (
                      cart[item._id] ? (
                        <div className="flex items-center justify-center gap-3 bg-gray-700/50 rounded-2xl p-2.5">
                          <motion.button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-8 h-8 rounded font-bold transition-all duration-300 cursor-pointer shadow-lg text-sm flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={14} />
                          </motion.button>
                          <span className="text-lg font-bold text-white min-w-[1.5rem] text-center">
                            {cart[item._id]}
                          </span>
                          <motion.button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-8 h-8 rounded font-bold transition-all duration-300 cursor-pointer shadow-lg text-sm flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => handleAddToCart(item._id)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 cursor-pointer shadow-lg group"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart size={16} className="group-hover:scale-110 transition-transform duration-300" />
                            Add to Cart
                          </span>
                        </motion.button>
                      )
                    ) : (
                      <div className="w-full bg-red-500/20 text-red-400 py-3 px-6 rounded-2xl font-semibold border border-red-500/30 text-center">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
          )}
        </motion.div>

        {/* Pagination */}
        <motion.div 
          className="flex justify-center items-center mt-16 gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg text-sm"
            whileHover={{ scale: page === 1 ? 1 : 1.05, y: page === 1 ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
          
          <div className="bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700">
            <span className="text-white font-medium text-sm">
              Page {page} of {totalPages}
            </span>
          </div>
          
          <motion.button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg text-sm"
            whileHover={{ scale: page === totalPages ? 1 : 1.05, y: page === totalPages ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Menu;
