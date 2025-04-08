import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  // Menu items
  const menuItems = [
    { name: "Biriyani", img: "/cb.png" },
    { name: "Burger", img: "/burger.png" },
    { name: "Pizza", img: "/pizza.png" },
    { name: "Waffles", img: "/waffels.png" },
    { name: "Ice Cream", img: "/icecream.png" },
    { name: "Smoothies", img: "/smoothies.png" },
  ];

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      <Navbar/>
      {/* Navigation Menu */}
      <div className="flex space-x-10 text-[20px] p-[62px] ml-[90px] drop-shadow-xl text-center">
        {["Home", "Foods", "Today Offers", "Contact us", "About us"].map(
          (item, index) => (
            <div key={index} className="hover:text-orange-600 cursor-pointer mr-[100px]">
              {item}
            </div>
          )
        )}
      </div>

      {/* Main Section */}
      <div className="flex-grow flex flex-col justify-center items-center relative">
        <h2 style={{ color: "#808080" }} className="text-7xl font-bold drop-shadow-xl opacity-[.67]">
          బిర్యానీ
        </h2>
        <h1 style={{ color: "#ff3d00" }} className="text-orange-500 text-6xl font-bold drop-shadow-lg -mt-3">
          Biriyani
        </h1>
        <p className="text-gray-300 mt-3">Made by Chicken, Rice, and Spices</p>

        {/* Biriyani Image */}
        <div className="mt-5 p-2 rounded-lg">
          <img src="/cb.png" className="w-64 rounded-lg drop-shadow-xl" alt="Main Biriyani" />
        </div>
      </div>

      {/* Explore Menu Section */}
      <div className="w-full px-10 py-16">
        <h2 className="text-orange-500 text-3xl font-bold mb-6">Explore Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="shadow-orange-500 p-6 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={item.img} alt={item.name} className="w-32 h-32 mb-4 rounded-lg" />
              <p className="text-white text-lg font-semibold">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore More Button */}
      <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="bg-transparent border-2 border-orange-500 text-orange-500 text-lg font-semibold px-6 py-3 rounded-lg flex items-center hover:bg-orange-500 hover:text-white transition"
          >
            Explore More <span className="ml-2 text-3xl">&rarr;</span>
          </button>
      </div>
    </div>
  );
}

export default LandingPage;
