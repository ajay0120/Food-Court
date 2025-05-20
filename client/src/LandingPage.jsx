import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

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

  const menuItems = [
    { name: "Biriyani", img: "/cb.png" },
    {name:"ajay", img: "/noImage.png" },
    { name: "Burger", img: "/burger.png" },
    { name: "Pizza", img: "/pizza.png" },
    { name: "Waffles", img: "/waffels.png" },
    { name: "Ice Cream", img: "/icecream.png" },
    { name: "Smoothies", img: "/smoothies.png" },
  ];

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
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      <Navbar />

      {/* Responsive Nav Menu */}
      <div className="flex flex-wrap justify-center gap-6 text-[18px] md:text-[20px] p-6 md:p-12">
        {["Home", "Foods", "Today Offers", "Contact us", "About us"].map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item)}
            className="bg-gray-900 px-4 py-2 rounded hover:bg-gray-800 hover:text-orange-600 transition cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Section */}
      <div className="flex-grow flex flex-col justify-center items-center px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-gray-400 drop-shadow-xl opacity-70">
          బిర్యానీ
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold text-orange-500 drop-shadow-lg -mt-2">
          Biriyani
        </h1>
        <p className="text-gray-300 mt-3 text-sm md:text-base">
          Made by Chicken, Rice, and Spices
        </p>

        {/* Image */}
        <div className="mt-5 p-2 rounded-lg">
          <img src="/cb.png" className="w-40 md:w-64 rounded-lg drop-shadow-xl" alt="Main Biriyani" />
        </div>
      </div>

      {/* Explore Menu Section */}
      <div className="w-full px-4 md:px-10 py-12 md:py-16">
        <h2 className="text-orange-500 text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          Explore Menu
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-10">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={item.img} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 mb-4 rounded-lg object-cover" />
              <p className="text-white text-base md:text-lg font-semibold">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore More Button */}
      <div className="mt-6 md:mt-10 flex justify-center">
        <button
          onClick={() => navigate("/menu")}
          className="bg-transparent border-2 border-orange-500 text-orange-500 text-base md:text-lg font-semibold px-5 md:px-6 py-2 md:py-3 rounded-lg flex items-center hover:bg-orange-500 hover:text-white transition cursor-pointer"
        >
          Explore More <span className="ml-2 text-xl md:text-3xl">&rarr;</span>
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
