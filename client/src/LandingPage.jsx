import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "./components/Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu?limit=100");
      // Get 6 random items from the response
      const allItems = res.data.items;
      const shuffled = allItems.sort(() => 0.5 - Math.random());
      const featured = shuffled.slice(0, 6);
      setMenuItems(featured);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      // Fallback to static data if API fails
      setMenuItems([
        { name: "Biriyani", img: "/cb.png", _id: "1", price: { org: 250 } },
        { name: "Burger", img: "/burger.png", _id: "2", price: { org: 150 } },
        { name: "Pizza", img: "/pizza.png", _id: "3", price: { org: 300 } },
        { name: "Waffles", img: "/waffels.png", _id: "4", price: { org: 120 } },
        { name: "Ice Cream", img: "/icecream.png", _id: "5", price: { org: 80 } },
        { name: "Smoothies", img: "/smoothies.png", _id: "6", price: { org: 100 } },
      ]);
    }
  };

  const handleNavigation = (item) => {
    switch (item) {
      case "Home":
        navigate("/");
        break;
      case "Foods":
        navigate("/menu");
        break;
      case "Today Offers":
        navigate("/offers");
        break;
      case "Contact us":
        navigate("/contact");
        break;
      case "About us":
        navigate("/about");
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen text-white flex flex-col items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      <Navbar />

      {/* Responsive Nav Menu */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 text-[16px] md:text-[18px] p-6 md:p-12 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {["Home", "Foods", "Today Offers", "Contact us", "About us"].map((item, index) => (
          <motion.button
            key={index}
            onClick={() => handleNavigation(item)}
            className="relative px-6 py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 shadow-lg backdrop-blur-sm hover:from-orange-600 hover:to-orange-500 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <span className="relative z-10 font-medium group-hover:text-white transition-colors duration-300">
              {item}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Section */}
      <motion.div 
        className="flex-grow flex flex-col justify-center items-center px-4 text-center relative z-10"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.h2 
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-2xl mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          బిర్యానీ
        </motion.h2>
        <motion.h1 
          className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl -mt-2 mb-4"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Biriyani
        </motion.h1>
        <motion.p 
          className="text-gray-300 mt-3 text-lg md:text-xl max-w-md leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Crafted with premium <span className="text-orange-400 font-semibold">Chicken</span>, aromatic <span className="text-orange-400 font-semibold">Basmati Rice</span>, and authentic <span className="text-orange-400 font-semibold">Spices</span>
        </motion.p>

        {/* Image with enhanced styling */}
        <motion.div 
          className="mt-8 relative group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl border border-gray-700 shadow-2xl">
            <img 
              src="/cb.png" 
              className="w-48 md:w-72 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300" 
              alt="Main Biriyani" 
            />
          </div>
          {/* Floating elements around image */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-500 rounded-full animate-bounce delay-2000"></div>
        </motion.div>
      </motion.div>

      {/* Explore Menu Section */}
      <motion.div 
        className="w-full px-4 md:px-10 py-12 md:py-16 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4">
              Explore Our Menu
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover a world of flavors with our carefully curated selection of authentic dishes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Image container */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="relative w-full h-24 md:h-32 object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  {/* Floating price badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    ₹{item.price?.org || 150}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">
                    {item.name}
                  </h3>
                  
                  {/* Add to cart button */}
                  <motion.button
                    onClick={() => navigate("/menu")}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Menu
                  </motion.button>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-orange-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Explore More Button */}
      <motion.div 
        className="mt-6 md:mt-10 flex justify-center relative z-10 pb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={() => navigate("/menu")}
          className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden border border-orange-400"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Button background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          
          <span className="relative z-10 flex items-center gap-3">
            <span>Explore Full Menu</span>
            <motion.div
              className="flex items-center"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-xl ml-1">→</span>
            </motion.div>
          </span>
          
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-1000"></div>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default LandingPage;
